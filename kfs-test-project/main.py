import os
import json
import sqlite3
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum, auto
from contextlib import contextmanager
import os
from dotenv import load_dotenv 
import requests
from flask import Flask, request, jsonify

load_dotenv()
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== Configuration ==============
class Config:
    BALE_TOKEN = os.environ.get('BALE_TOKEN', 'YOUR_BOT_TOKEN')
    BALE_API_BASE = 'https://tapi.bale.ai/bot'
    DATABASE_PATH = os.environ.get('DATABASE_PATH', 'store_bot.db')
    WEBHOOK_URL = os.environ.get('WEBHOOK_URL', '')
    WEBHOOK_PORT = int(os.environ.get('WEBHOOK_PORT', 8443))
    ADMIN_CHAT_ID = int(os.environ.get('ADMIN_CHAT_ID', 0))

# ============== Bale API Client ==============
class BaleAPI:
    """Handles all communication with Bale Bot API"""
    
    def __init__(self, token: str):
        self.token = token
        self.base_url = f"{Config.BALE_API_BASE}{token}"
        self.session = requests.Session()
    
    def _make_request(self, method: str, data: Dict = None, files: Dict = None) -> Dict:
        """Make API request to Bale"""
        url = f"{self.base_url}/{method}"
        try:
            if files:
                response = self.session.post(url, data=data, files=files)
            elif data:
                response = self.session.post(url, json=data)
            else:
                response = self.session.get(url)
            
            result = response.json()
            
            if not result.get('ok'):
                error_code = result.get('error_code', 'Unknown')
                description = result.get('description', 'No description')
                logger.error(f"API Error {error_code}: {description}")
                return {'ok': False, 'error': description}
            
            return result
        
        except Exception as e:
            logger.error(f"Request failed: {e}")
            return {'ok': False, 'error': str(e)}
    
    def send_message(self, chat_id: int, text: str, 
                     reply_markup: Dict = None,
                     parse_mode: str = 'Markdown') -> Dict:
        """Send text message"""
        data = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': parse_mode
        }
        if reply_markup:
            data['reply_markup'] = json.dumps(reply_markup)
        return self._make_request('sendMessage', data)
    
    def send_photo(self, chat_id: int, photo: str,
                   caption: str = None,
                   reply_markup: Dict = None) -> Dict:
        """Send photo message"""
        data = {'chat_id': chat_id}
        if photo.startswith('http'):
            data['photo'] = photo
        else:
            data['photo'] = photo  # file_id
        if caption:
            data['caption'] = caption
        if reply_markup:
            data['reply_markup'] = json.dumps(reply_markup)
        return self._make_request('sendPhoto', data)
    
    def edit_message_text(self, chat_id: int, message_id: int,
                          text: str, reply_markup: Dict = None) -> Dict:
        """Edit existing message"""
        data = {
            'chat_id': chat_id,
            'message_id': message_id,
            'text': text,
            'parse_mode': 'Markdown'
        }
        if reply_markup:
            data['reply_markup'] = json.dumps(reply_markup)
        return self._make_request('editMessageText', data)
    
    def edit_message_reply_markup(self, chat_id: int, message_id: int,
                                   reply_markup: Dict = None) -> Dict:
        """Edit message keyboard"""
        data = {
            'chat_id': chat_id,
            'message_id': message_id
        }
        if reply_markup:
            data['reply_markup'] = json.dumps(reply_markup)
        return self._make_request('editMessageReplyMarkup', data)
    
    def answer_callback_query(self, callback_query_id: str,
                               text: str = None,
                               show_alert: bool = False) -> Dict:
        """Answer callback query"""
        data = {'callback_query_id': callback_query_id}
        if text:
            data['text'] = text
        if show_alert:
            data['show_alert'] = True
        return self._make_request('answerCallbackQuery', data)
    
    def delete_message(self, chat_id: int, message_id: int) -> Dict:
        """Delete message"""
        return self._make_request('deleteMessage', {
            'chat_id': chat_id,
            'message_id': message_id
        })
    
    def get_file(self, file_id: str) -> Dict:
        """Get file info"""
        return self._make_request('getFile', {'file_id': file_id})
    
    def send_chat_action(self, chat_id: int, action: str = 'typing') -> Dict:
        """Send chat action (typing, upload_photo, etc.)"""
        return self._make_request('sendChatAction', {
            'chat_id': chat_id,
            'action': action
        })
    
    def set_webhook(self, url: str) -> Dict:
        """Set webhook URL"""
        return self._make_request('setWebhook', {'url': url})
    
    def delete_webhook(self) -> Dict:
        """Delete webhook"""
        return self._make_request('deleteWebhook')
    
    def get_updates(self, offset: int = None, timeout: int = 30) -> Dict:
        """Get updates via long polling"""
        data = {'timeout': timeout}
        if offset:
            data['offset'] = offset
        return self._make_request('getUpdates', data)

# ============== Database Manager ==============
class DatabaseManager:
    """SQLite database manager for the store bot"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_database()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            conn.close()
    
    def _init_database(self):
        """Initialize database tables"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Stores table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    owner_chat_id INTEGER UNIQUE NOT NULL,
                    store_name TEXT NOT NULL,
                    description TEXT,
                    phone TEXT,
                    address TEXT,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Products table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    store_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    description TEXT,
                    stock INTEGER DEFAULT 0,
                    photo_file_id TEXT,
                    is_available BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (store_id) REFERENCES stores (id)
                )
            ''')
            
            # Customers table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id INTEGER UNIQUE NOT NULL,
                    name TEXT,
                    phone TEXT,
                    address TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Orders table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_number TEXT UNIQUE NOT NULL,
                    customer_chat_id INTEGER NOT NULL,
                    store_id INTEGER NOT NULL,
                    products_json TEXT NOT NULL,
                    total_amount INTEGER NOT NULL,
                    status TEXT DEFAULT 'pending',
                    customer_name TEXT,
                    customer_phone TEXT,
                    customer_address TEXT,
                    notes TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (store_id) REFERENCES stores (id)
                )
            ''')
            
            # User states table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_states (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id INTEGER UNIQUE NOT NULL,
                    state TEXT,
                    data TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Shopping carts table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS carts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_chat_id INTEGER NOT NULL,
                    store_id INTEGER NOT NULL,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (store_id) REFERENCES stores (id),
                    FOREIGN KEY (product_id) REFERENCES products (id)
                )
            ''')
            
            logger.info("Database initialized successfully")

# ============== Data Models ==============
class UserState(Enum):
    """User conversation states"""
    IDLE = auto()
    
    # Store registration states
    STORE_NAME = auto()
    STORE_DESCRIPTION = auto()
    STORE_PHONE = auto()
    STORE_ADDRESS = auto()
    
    # Product management states
    PRODUCT_NAME = auto()
    PRODUCT_PRICE = auto()
    PRODUCT_DESCRIPTION = auto()
    PRODUCT_STOCK = auto()
    PRODUCT_PHOTO = auto()
    
    # Checkout states
    CUSTOMER_NAME = auto()
    CUSTOMER_PHONE = auto()
    CUSTOMER_ADDRESS = auto()
    ORDER_NOTES = auto()

class OrderStatus(Enum):
    """Order status enum"""
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    PROCESSING = 'processing'
    SHIPPED = 'shipped'
    DELIVERED = 'delivered'
    CANCELLED = 'cancelled'
    
    @classmethod
    def get_persian(cls, status: str) -> str:
        translations = {
            'pending': 'در انتظار تأیید',
            'confirmed': 'تأیید شده',
            'processing': 'در حال آماده‌سازی',
            'shipped': 'ارسال شده',
            'delivered': 'تحویل داده شده',
            'cancelled': 'لغو شده'
        }
        return translations.get(status, status)

@dataclass
class Store:
    """Store data model"""
    id: int = None
    owner_chat_id: int = None
    store_name: str = ''
    description: str = ''
    phone: str = ''
    address: str = ''
    is_active: bool = True

@dataclass
class Product:
    """Product data model"""
    id: int = None
    store_id: int = None
    name: str = ''
    price: int = 0
    description: str = ''
    stock: int = 0
    photo_file_id: str = ''
    is_available: bool = True

@dataclass
class CartItem:
    """Cart item data model"""
    product_id: int
    name: str
    price: int
    quantity: int

# ============== Keyboard Builders ==============
class Keyboards:
    """Build various keyboards for the bot"""
    
    @staticmethod
    def main_menu(is_store_owner: bool = False) -> Dict:
        """Main menu keyboard"""
        if is_store_owner:
            buttons = [
                [{'text': '🏪 مدیریت فروشگاه'}],
                [{'text': '📦 مدیریت محصولات'}],
                [{'text': '📋 سفارش‌ها'}],
                [{'text': '📊 گزارش‌ها'}]
            ]
        else:
            buttons = [
                [{'text': '🛍️ مشاهده فروشگاه‌ها'}],
                [{'text': '🛒 سبد خرید من'}],
                [{'text': '📦 سفارش‌های من'}],
                [{'text': '👤 پروفایل من'}]
            ]
        return {'keyboard': buttons, 'resize_keyboard': True}
    
    @staticmethod
    def store_management() -> Dict:
        """Store management menu"""
        buttons = [
            [{'text': '✏️ ویرایش اطلاعات'}, {'text': '👁️ پیش‌نمایش فروشگاه'}],
            [{'text': '🔓 deactivate/activate'}, {'text': '🔙 بازگشت'}]
        ]
        return {'keyboard': buttons, 'resize_keyboard': True}
    
    @staticmethod
    def product_management() -> Dict:
        """Product management menu"""
        buttons = [
            [{'text': '➕ افزودن محصول'}],
            [{'text': '📝 ویرایش محصول'}, {'text': '🗑️ حذف محصول'}],
            [{'text': '📋 لیست محصولات'}],
            [{'text': '🔙 بازگشت'}]
        ]
        return {'keyboard': buttons, 'resize_keyboard': True}
    
    @staticmethod
    def cancel_keyboard() -> Dict:
        """Cancel button keyboard"""
        return {'keyboard': [[{'text': '❌ انصراف'}]], 'resize_keyboard': True}
    
    @staticmethod
    def skip_photo_keyboard() -> Dict:
        """Skip photo button"""
        return {'keyboard': [[{'text': '⏭️ رد کردن'}, {'text': '❌ انصراف'}]], 'resize_keyboard': True}
    
    @staticmethod
    def order_actions(order_id: int) -> Dict:
        """Inline keyboard for order actions"""
        return {
            'inline_keyboard': [
                [
                    {'text': '✅ تأیید', 'callback_data': f'order_confirm_{order_id}'},
                    {'text': '❌ رد', 'callback_data': f'order_cancel_{order_id}'}
                ],
                [
                    {'text': '📦 در حال آماده‌سازی', 'callback_data': f'order_process_{order_id}'}
                ],
                [
                    {'text': '🚚 ارسال شده', 'callback_data': f'order_ship_{order_id}'},
                    {'text': '✓ تحویل', 'callback_data': f'order_deliver_{order_id}'}
                ]
            ]
        }
    
    @staticmethod
    def product_list(products: List[Product], store_id: int) -> Dict:
        """Inline keyboard for product listing"""
        keyboard = []
        for product in products:
            keyboard.append([{
                'text': f"{product.name} - {product.price:,} تومان (موجودی: {product.stock})",
                'callback_data': f'product_{store_id}_{product.id}'
            }])
        keyboard.append([{'text': '🛒 مشاهده سبد خرید', 'callback_data': f'cart_{store_id}'}])
        keyboard.append([{'text': '🔙 بازگشت', 'callback_data': 'back_stores'}])
        return {'inline_keyboard': keyboard}
    
    @staticmethod
    def add_to_cart(product_id: int, store_id: int) -> Dict:
        """Add to cart inline keyboard"""
        return {
            'inline_keyboard': [
                [
                    {'text': '➖', 'callback_data': f'qty_dec_{product_id}'},
                    {'text': '1', 'callback_data': f'qty_show_{product_id}'},
                    {'text': '➕', 'callback_data': f'qty_inc_{product_id}'}
                ],
                [
                    {'text': '🛒 افزودن به سبد', 'callback_data': f'add_cart_{store_id}_{product_id}'}
                ],
                [
                    {'text': '🔙 بازگشت', 'callback_data': f'store_{store_id}'}
                ]
            ]
        }
    
    @staticmethod
    def cart_actions(store_id: int) -> Dict:
        """Cart management keyboard"""
        return {
            'inline_keyboard': [
                [
                    {'text': '✅ تکمیل خرید', 'callback_data': f'checkout_{store_id}'},
                    {'text': '🗑️ پاک کردن', 'callback_data': f'clear_cart_{store_id}'}
                ],
                [
                    {'text': '➕ افزودن محصول', 'callback_data': f'store_{store_id}'}
                ]
            ]
        }
    
    @staticmethod
    def stores_list(stores: List[Store]) -> Dict:
        """Inline keyboard for stores list"""
        keyboard = []
        for store in stores:
            keyboard.append([{
                'text': f"🏪 {store.store_name}",
                'callback_data': f'store_{store.id}'
            }])
        return {'inline_keyboard': keyboard}
    
    @staticmethod
    def remove_keyboard() -> Dict:
        """Remove keyboard"""
        return {'remove_keyboard': True}

# ============== Store Bot Logic ==============
class StoreBot:
    """Main bot logic class"""
    
    def __init__(self, token: str, db_path: str):
        self.api = BaleAPI(token)
        self.db = DatabaseManager(db_path)
        self.keyboards = Keyboards()
        
        # In-memory temporary storage
        self.temp_data: Dict[int, Dict] = {}
        self.temp_quantities: Dict[int, int] = {}
    
    def _generate_order_number(self) -> str:
        """Generate unique order number"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        import random
        random_part = random.randint(100, 999)
        return f"ORD-{timestamp}-{random_part}"
    
    def _format_price(self, price: int) -> str:
        """Format price with Persian number format"""
        return f"{price:,} تومان"
    
    def _get_user_state(self, chat_id: int) -> tuple:
        """Get user state from database"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT state, data FROM user_states WHERE chat_id = ?',
                (chat_id,)
            )
            row = cursor.fetchone()
            if row:
                return row['state'], json.loads(row['data']) if row['data'] else {}
            return 'IDLE', {}
    
    def _set_user_state(self, chat_id: int, state: str, data: Dict = None):
        """Set user state in database"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO user_states (chat_id, state, data, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(chat_id) DO UPDATE SET
                    state = excluded.state,
                    data = excluded.data,
                    updated_at = CURRENT_TIMESTAMP
            ''', (chat_id, state, json.dumps(data) if data else None))
    
    def _clear_user_state(self, chat_id: int):
        """Clear user state"""
        self._set_user_state(chat_id, 'IDLE', {})
    
    def _get_store_by_owner(self, chat_id: int) -> Optional[Store]:
        """Get store by owner chat ID"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM stores WHERE owner_chat_id = ?',
                (chat_id,)
            )
            row = cursor.fetchone()
            if row:
                return Store(**dict(row))
        return None
    
    def _get_store_by_id(self, store_id: int) -> Optional[Store]:
        """Get store by ID"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM stores WHERE id = ?',
                (store_id,)
            )
            row = cursor.fetchone()
            if row:
                return Store(**dict(row))
        return None
    
    def _get_product(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM products WHERE id = ?',
                (product_id,)
            )
            row = cursor.fetchone()
            if row:
                return Product(**dict(row))
        return None
    
    def _get_cart(self, customer_chat_id: int, store_id: int) -> List[CartItem]:
        """Get customer cart items"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT c.product_id, c.quantity, p.name, p.price
                FROM carts c
                JOIN products p ON c.product_id = p.id
                WHERE c.customer_chat_id = ? AND c.store_id = ?
            ''', (customer_chat_id, store_id))
            
            items = []
            for row in cursor.fetchall():
                items.append(CartItem(
                    product_id=row['product_id'],
                    name=row['name'],
                    price=row['price'],
                    quantity=row['quantity']
                ))
            return items
    
    def _clear_cart(self, customer_chat_id: int, store_id: int):
        """Clear customer cart"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                DELETE FROM carts
                WHERE customer_chat_id = ? AND store_id = ?
            ''', (customer_chat_id, store_id))
    
    def _add_to_cart(self, customer_chat_id: int, store_id: int, 
                     product_id: int, quantity: int = 1):
        """Add product to cart"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Check if already in cart
            cursor.execute('''
                SELECT id, quantity FROM carts
                WHERE customer_chat_id = ? AND product_id = ?
            ''', (customer_chat_id, product_id))
            
            existing = cursor.fetchone()
            
            if existing:
                # Update quantity
                new_qty = existing['quantity'] + quantity
                cursor.execute('''
                    UPDATE carts SET quantity = ? WHERE id = ?
                ''', (new_qty, existing['id']))
            else:
                # Insert new
                cursor.execute('''
                    INSERT INTO carts (customer_chat_id, store_id, product_id, quantity)
                    VALUES (?, ?, ?, ?)
                ''', (customer_chat_id, store_id, product_id, quantity))
    
    def handle_message(self, message: Dict):
        """Handle incoming message"""
        chat_id = message['chat']['id']
        text = message.get('text', '')
        
        logger.info(f"Message from {chat_id}: {text}")
        
        # Get user state
        state, state_data = self._get_user_state(chat_id)
        
        # Handle state-based messages first
        if state != 'IDLE':
            self._handle_state_message(chat_id, text, state, state_data, message)
            return
        
        # Handle commands
        if text.startswith('/'):
            self._handle_command(chat_id, text)
            return
        
        # Handle text buttons
        self._handle_button(chat_id, text, message)
    
    def _handle_state_message(self, chat_id: int, text: str, state: str, 
                               state_data: Dict, message: Dict):
        """Handle messages based on conversation state"""
        
        # Cancel handling
        if text == '❌ انصراف':
            self._clear_user_state(chat_id)
            self._send_welcome(chat_id)
            return
        
        # Store registration flow
        if state == 'STORE_NAME':
            state_data['store_name'] = text
            self._set_user_state(chat_id, 'STORE_DESCRIPTION', state_data)
            self.api.send_message(
                chat_id,
                "📝 لطفاً توضیحات فروشگاه را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'STORE_DESCRIPTION':
            state_data['description'] = text
            self._set_user_state(chat_id, 'STORE_PHONE', state_data)
            self.api.send_message(
                chat_id,
                "📞 لطفاً شماره تماس فروشگاه را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'STORE_PHONE':
            state_data['phone'] = text
            self._set_user_state(chat_id, 'STORE_ADDRESS', state_data)
            self.api.send_message(
                chat_id,
                "📍 لطفاً آدرس فروشگاه را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'STORE_ADDRESS':
            state_data['address'] = text
            # Save store to database
            self._save_store(chat_id, state_data)
            self._clear_user_state(chat_id)
            self.api.send_message(
                chat_id,
                "✅ فروشگاه شما با موفقیت ثبت شد!",
                self.keyboards.main_menu(is_store_owner=True)
            )
            return
        
        # Product addition flow
        if state == 'PRODUCT_NAME':
            state_data['product_name'] = text
            self._set_user_state(chat_id, 'PRODUCT_PRICE', state_data)
            self.api.send_message(
                chat_id,
                "💰 لطفاً قیمت محصول را وارد کنید (به تومان):",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'PRODUCT_PRICE':
            try:
                price = int(text.replace(',', '').replace('تومان', '').strip())
                state_data['price'] = price
                self._set_user_state(chat_id, 'PRODUCT_DESCRIPTION', state_data)
                self.api.send_message(
                    chat_id,
                    "📝 لطفاً توضیحات محصول را وارد کنید:",
                    self.keyboards.cancel_keyboard()
                )
            except ValueError:
                self.api.send_message(chat_id, "⚠️ لطفاً یک عدد معتبر وارد کنید.")
            return
        
        if state == 'PRODUCT_DESCRIPTION':
            state_data['description'] = text
            self._set_user_state(chat_id, 'PRODUCT_STOCK', state_data)
            self.api.send_message(
                chat_id,
                "📦 لطفاً موجودی محصول را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'PRODUCT_STOCK':
            try:
                stock = int(text)
                state_data['stock'] = stock
                self._set_user_state(chat_id, 'PRODUCT_PHOTO', state_data)
                self.api.send_message(
                    chat_id,
                    "📷 لطفاً عکس محصول را ارسال کنید:",
                    self.keyboards.skip_photo_keyboard()
                )
            except ValueError:
                self.api.send_message(chat_id, "⚠️ لطفاً یک عدد معتبر وارد کنید.")
            return
        
        if state == 'PRODUCT_PHOTO':
            # Handle photo or skip
            if text == '⏭️ رد کردن':
                self._save_product(chat_id, state_data, None)
            elif 'photo' in message:
                # Get largest photo
                photos = message['photo']
                largest_photo = photos[-1]
                self._save_product(chat_id, state_data, largest_photo['file_id'])
            else:
                self.api.send_message(chat_id, "⚠️ لطفاً یک عکس ارسال کنید یا رد کنید.")
                return
            
            self._clear_user_state(chat_id)
            self.api.send_message(
                chat_id,
                "✅ محصول با موفقیت اضافه شد!",
                self.keyboards.product_management()
            )
            return
        
        # Checkout flow
        if state == 'CUSTOMER_NAME':
            state_data['customer_name'] = text
            self._set_user_state(chat_id, 'CUSTOMER_PHONE', state_data)
            self.api.send_message(
                chat_id,
                "📞 لطفاً شماره تماس خود را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'CUSTOMER_PHONE':
            state_data['customer_phone'] = text
            self._set_user_state(chat_id, 'CUSTOMER_ADDRESS', state_data)
            self.api.send_message(
                chat_id,
                "📍 لطفاً آدرس تحویل را وارد کنید:",
                self.keyboards.cancel_keyboard()
            )
            return
        
        if state == 'CUSTOMER_ADDRESS':
            state_data['customer_address'] = text
            self._set_user_state(chat_id, 'ORDER_NOTES', state_data)
            self.api.send_message(
                chat_id,
                "📝 توضیحات اضافی (اختیاری):",
                {'keyboard': [[{'text': 'بدون توضیحات'}, {'text': '❌ انصراف'}]], 'resize_keyboard': True}
            )
            return
        
        if state == 'ORDER_NOTES':
            if text != 'بدون توضیحات':
                state_data['notes'] = text
            self._process_checkout(chat_id, state_data)
            self._clear_user_state(chat_id)
            return
    
    def _handle_command(self, chat_id: int, text: str):
        """Handle bot commands"""
        command = text.split()[0].lower()
        
        if command == '/start':
            self._handle_start(chat_id)
        elif command == '/register_store':
            self._start_store_registration(chat_id)
        elif command == '/menu':
            self._send_welcome(chat_id)
        elif command == '/add_product':
            self._start_product_addition(chat_id)
        elif command == '/inventory':
            self._show_inventory(chat_id)
        elif command == '/orders':
            self._show_store_orders(chat_id)
        elif command == '/my_orders':
            self._show_customer_orders(chat_id)
        else:
            self.api.send_message(chat_id, "⚠️ دستور نامعتبر است.")
    
    def _handle_button(self, chat_id: int, text: str, message: Dict):
        """Handle button clicks"""
        store = self._get_store_by_owner(chat_id)
        
        # Main menu buttons
        if text == '🏪 مدیریت فروشگاه':
            if store:
                self.api.send_message(
                    chat_id,
                    f"🏪 *{store.store_name}*\n\n"
                    f"📝 {store.description or 'بدون توضیحات'}\n"
                    f"📞 {store.phone or 'ثبت نشده'}\n"
                    f"📍 {store.address or 'ثبت نشده'}",
                    self.keyboards.store_management()
                )
            else:
                self._start_store_registration(chat_id)
        
        elif text == '📦 مدیریت محصولات':
            self.api.send_message(
                chat_id,
                "📦 مدیریت محصولات",
                self.keyboards.product_management()
            )
        
        elif text == '📋 سفارش‌ها':
            self._show_store_orders(chat_id)
        
        elif text == '📊 گزارش‌ها':
            self._show_reports(chat_id)
        
        elif text == '🛍️ مشاهده فروشگاه‌ها':
            self._show_stores_list(chat_id)
        
        elif text == '🛒 سبد خرید من':
            self._show_my_cart(chat_id)
        
        elif text == '📦 سفارش‌های من':
            self._show_customer_orders(chat_id)
        
        elif text == '👤 پروفایل من':
            self._show_profile(chat_id)
        
        elif text == '➕ افزودن محصول':
            self._start_product_addition(chat_id)
        
        elif text == '📋 لیست محصولات':
            self._show_inventory(chat_id)
        
        elif text == '🔙 بازگشت':
            self._send_welcome(chat_id)
        
        # Store management
        elif text == '✏️ ویرایش اطلاعات':
            self.api.send_message(
                chat_id,
                "برای ویرایش اطلاعات فروشگاه، از دستورات زیر استفاده کنید:\n\n"
                "/edit_name - ویرایش نام\n"
                "/edit_desc - ویرایش توضیحات\n"
                "/edit_phone - ویرایش تلفن\n"
                "/edit_address - ویرایش آدرس"
            )
        
        elif text == '👁️ پیش‌نمایش فروشگاه':
            if store:
                self._show_store_preview(chat_id, store)
    
    def handle_callback(self, callback: Dict):
        """Handle callback queries"""
        chat_id = callback['from']['id']
        data = callback['data']
        message = callback.get('message', {})
        message_id = message.get('message_id')
        callback_id = callback['id']
        
        logger.info(f"Callback from {chat_id}: {data}")
        
        # Parse callback data
        parts = data.split('_')
        action = parts[0]
        
        try:
            if action == 'store':
                store_id = int(parts[1])
                self._show_store_products(chat_id, message_id, store_id)
            
            elif action == 'product':
                store_id = int(parts[1])
                product_id = int(parts[2])
                self._show_product_detail(chat_id, message_id, product_id, store_id)
            
            elif action == 'qty':
                self._handle_quantity_change(chat_id, message_id, parts)
            
            elif action == 'add':
                if parts[1] == 'cart':
                    store_id = int(parts[2])
                    product_id = int(parts[3])
                    self._add_product_to_cart(chat_id, store_id, product_id)
            
            elif action == 'cart':
                store_id = int(parts[1])
                self._show_cart(chat_id, message_id, store_id)
            
            elif action == 'checkout':
                store_id = int(parts[1])
                self._start_checkout(chat_id, store_id)
            
            elif action == 'clear':
                if parts[1] == 'cart':
                    store_id = int(parts[2])
                    self._clear_cart(chat_id, store_id)
                    self.api.answer_callback_query(callback_id, "سبد خرید پاک شد!")
                    self._show_stores_list(chat_id)
            
            elif action == 'order':
                self._handle_order_action(chat_id, callback_id, parts)
            
            elif action == 'back':
                if parts[1] == 'stores':
                    self._show_stores_list(chat_id, message_id)
            
            # Answer callback
            self.api.answer_callback_query(callback_id)
            
        except Exception as e:
            logger.error(f"Callback error: {e}")
            self.api.answer_callback_query(callback_id, "خطایی رخ داد!")
    
    def _handle_start(self, chat_id: int):
        """Handle /start command"""
        store = self._get_store_by_owner(chat_id)
        is_store_owner = store is not None
        
        welcome_text = (
            "👋 خوش آمدید به ربات مدیریت فروشگاه!\n\n"
            "شما می‌توانید:\n"
            "• فروشگاه خود را ثبت کنید\n"
            "• محصولات خود را مدیریت کنید\n"
            "• سفارش‌ها را پیگیری کنید\n\n"
            "از منوی زیر انتخاب کنید:"
        )
        
        self.api.send_message(
            chat_id,
            welcome_text,
            self.keyboards.main_menu(is_store_owner)
        )
    
    def _send_welcome(self, chat_id: int):
        """Send welcome/main menu"""
        self._handle_start(chat_id)
    
    def _start_store_registration(self, chat_id: int):
        """Start store registration process"""
        existing_store = self._get_store_by_owner(chat_id)
        if existing_store:
            self.api.send_message(
                chat_id,
                "⚠️ شما قبلاً یک فروشگاه ثبت کرده‌اید."
            )
            return
        
        self._set_user_state(chat_id, 'STORE_NAME', {})
        self.api.send_message(
            chat_id,
            "🏪 ثبت فروشگاه جدید\n\n"
            "لطفاً نام فروشگاه را وارد کنید:",
            self.keyboards.cancel_keyboard()
        )
    
    def _save_store(self, chat_id: int, data: Dict):
        """Save store to database"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO stores (owner_chat_id, store_name, description, phone, address)
                VALUES (?, ?, ?, ?, ?)
            ''', (chat_id, data['store_name'], data.get('description', ''),
                  data.get('phone', ''), data.get('address', '')))
    
    def _start_product_addition(self, chat_id: int):
        """Start product addition process"""
        store = self._get_store_by_owner(chat_id)
        if not store:
            self.api.send_message(
                chat_id,
                "⚠️ ابتدا باید یک فروشگاه ثبت کنید.\n"
                "از دستور /register_store استفاده کنید."
            )
            return
        
        self._set_user_state(chat_id, 'PRODUCT_NAME', {'store_id': store.id})
        self.api.send_message(
            chat_id,
            "➕ افزودن محصول جدید\n\n"
            "لطفاً نام محصول را وارد کنید:",
            self.keyboards.cancel_keyboard()
        )
    
    def _save_product(self, chat_id: int, data: Dict, photo_file_id: str = None):
        """Save product to database"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO products (store_id, name, price, description, stock, photo_file_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (data['store_id'], data['product_name'], data['price'],
                  data.get('description', ''), data.get('stock', 0), photo_file_id))
    
    def _show_inventory(self, chat_id: int):
        """Show product inventory"""
        store = self._get_store_by_owner(chat_id)
        if not store:
            self.api.send_message(chat_id, "⚠️ فروشگاهی یافت نشد.")
            return
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC',
                (store.id,)
            )
            products = cursor.fetchall()
        
        if not products:
            self.api.send_message(chat_id, "📦 هیچ محصولی ثبت نشده است.")
            return
        
        text = "📦 *لیست محصولات شما:*\n\n"
        for p in products:
            status = "✅" if p['is_available'] else "❌"
            text += (
                f"{status} *{p['name']}*\n"
                f"   💰 {p['price']:,} تومان\n"
                f"   📦 موجودی: {p['stock']}\n\n"
            )
        
        self.api.send_message(chat_id, text)
    
    def _show_store_orders(self, chat_id: int):
        """Show store orders"""
        store = self._get_store_by_owner(chat_id)
        if not store:
            self.api.send_message(chat_id, "⚠️ فروشگاهی یافت نشد.")
            return
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM orders 
                WHERE store_id = ? 
                ORDER BY created_at DESC
                LIMIT 20
            ''', (store.id,))
            orders = cursor.fetchall()
        
        if not orders:
            self.api.send_message(chat_id, "📋 سفارشی یافت نشد.")
            return
        
        text = "📋 *سفارش‌های شما:*\n\n"
        for order in orders:
            status_emoji = {
                'pending': '⏳',
                'confirmed': '✅',
                'processing': '🔄',
                'shipped': '🚚',
                'delivered': '✓',
                'cancelled': '❌'
            }.get(order['status'], '❓')
            
            text += (
                f"{status_emoji} *{order['order_number']}*\n"
                f"   💰 {order['total_amount']:,} تومان\n"
                f"   📅 {order['created_at'][:10]}\n\n"
            )
        
        self.api.send_message(chat_id, text)
    
    def _show_customer_orders(self, chat_id: int):
        """Show customer orders"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT o.*, s.store_name 
                FROM orders o
                JOIN stores s ON o.store_id = s.id
                WHERE o.customer_chat_id = ?
                ORDER BY o.created_at DESC
                LIMIT 10
            ''', (chat_id,))
            orders = cursor.fetchall()
        
        if not orders:
            self.api.send_message(chat_id, "📦 سفارشی ثبت نکرده‌اید.")
            return
        
        text = "📦 *سفارش‌های من:*\n\n"
        for order in orders:
            status = OrderStatus.get_persian(order['status'])
            text += (
                f"🏪 *{order['store_name']}*\n"
                f"   📋 شماره: {order['order_number']}\n"
                f"   💰 {order['total_amount']:,} تومان\n"
                f"   📊 وضعیت: {status}\n\n"
            )
        
        self.api.send_message(chat_id, text)
    
    def _show_stores_list(self, chat_id: int, message_id: int = None):
        """Show list of active stores"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT * FROM stores WHERE is_active = 1'
            )
            stores = cursor.fetchall()
        
        if not stores:
            text = "🏪 در حال حاضر فروشگاه فعالی وجود ندارد."
            if message_id:
                self.api.edit_message_text(chat_id, message_id, text)
            else:
                self.api.send_message(chat_id, text)
            return
        
        store_objects = [Store(**dict(s)) for s in stores]
        keyboard = self.keyboards.stores_list(store_objects)
        
        if message_id:
            self.api.edit_message_text(
                chat_id, message_id,
                "🏪 *فروشگاه‌های فعال:*\n\nیک فروشگاه را انتخاب کنید:",
                keyboard
            )
        else:
            self.api.send_message(
                chat_id,
                "🏪 *فروشگاه‌های فعال:*\n\nیک فروشگاه را انتخاب کنید:",
                keyboard
            )
    
    def _show_store_products(self, chat_id: int, message_id: int, store_id: int):
        """Show products of a store"""
        store = self._get_store_by_id(store_id)
        if not store:
            return
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM products 
                WHERE store_id = ? AND is_available = 1 AND stock > 0
            ''', (store_id,))
            products = cursor.fetchall()
        
        if not products:
            self.api.edit_message_text(
                chat_id, message_id,
                f"🏪 *{store.store_name}*\n\n"
                "این فروشگاه در حال حاضر محصولی ندارد."
            )
            return
        
        product_objects = [Product(**dict(p)) for p in products]
        keyboard = self.keyboards.product_list(product_objects, store_id)
        
        self.api.edit_message_text(
            chat_id, message_id,
            f"🏪 *{store.store_name}*\n\n"
            f"📝 {store.description or 'بدون توضیحات'}\n\n"
            "محصولات:",
            keyboard
        )
    
    def _show_product_detail(self, chat_id: int, message_id: int, 
                              product_id: int, store_id: int):
        """Show product detail with add to cart option"""
        product = self._get_product(product_id)
        if not product:
            return
        
        self.temp_quantities[chat_id] = 1
        
        keyboard = self.keyboards.add_to_cart(product_id, store_id)
        text = (
            f"📦 *{product.name}*\n\n"
            f"💰 قیمت: {product.price:,} تومان\n"
            f"📦 موجودی: {product.stock}\n\n"
            f"📝 {product.description or 'بدون توضیحات'}"
        )
        
        self.api.edit_message_text(chat_id, message_id, text, keyboard)
    
    def _handle_quantity_change(self, chat_id: int, message_id: int, parts: List[str]):
        """Handle quantity increment/decrement"""
        action = parts[1]  # inc or dec
        product_id = int(parts[2])
        
        product = self._get_product(product_id)
        if not product:
            return
        
        current_qty = self.temp_quantities.get(chat_id, 1)
        
        if action == 'inc':
            current_qty = min(current_qty + 1, product.stock)
        elif action == 'dec':
            current_qty = max(current_qty - 1, 1)
        
        self.temp_quantities[chat_id] = current_qty
        
        # Update keyboard with new quantity
        keyboard = {
            'inline_keyboard': [
                [
                    {'text': '➖', 'callback_data': f'qty_dec_{product_id}'},
                    {'text': str(current_qty), 'callback_data': f'qty_show_{product_id}'},
                    {'text': '➕', 'callback_data': f'qty_inc_{product_id}'}
                ],
                [
                    {'text': '🛒 افزودن به سبد', 'callback_data': f'add_cart_{product.store_id}_{product_id}'}
                ],
                [
                    {'text': '🔙 بازگشت', 'callback_data': f'store_{product.store_id}'}
                ]
            ]
        }
        
        self.api.edit_message_reply_markup(chat_id, message_id, keyboard)
    
    def _add_product_to_cart(self, chat_id: int, store_id: int, product_id: int):
        """Add product to cart with selected quantity"""
        quantity = self.temp_quantities.get(chat_id, 1)
        self._add_to_cart(chat_id, store_id, product_id, quantity)
        
        product = self._get_product(product_id)
        self.api.send_message(
            chat_id,
            f"✅ {quantity} عدد «{product.name}» به سبد خرید اضافه شد."
        )
    
    def _show_cart(self, chat_id: int, message_id: int, store_id: int):
        """Show customer cart"""
        items = self._get_cart(chat_id, store_id)
        store = self._get_store_by_id(store_id)
        
        if not items:
            self.api.edit_message_text(
                chat_id, message_id,
                "🛒 سبد خرید شما خالی است."
            )
            return
        
        total = sum(item.price * item.quantity for item in items)
        
        text = f"🛒 *سبد خرید - {store.store_name}*\n\n"
        for item in items:
            text += f"• {item.name} x {item.quantity} = {item.price * item.quantity:,} تومان\n"
        
        text += f"\n💰 *جمع کل: {total:,} تومان*"
        
        keyboard = self.keyboards.cart_actions(store_id)
        self.api.edit_message_text(chat_id, message_id, text, keyboard)
    
    def _show_my_cart(self, chat_id: int):
        """Show user's carts across all stores"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT c.store_id, s.store_name, COUNT(*) as item_count, 
                       SUM(c.quantity * p.price) as total
                FROM carts c
                JOIN stores s ON c.store_id = s.id
                JOIN products p ON c.product_id = p.id
                WHERE c.customer_chat_id = ?
                GROUP BY c.store_id
            ''', (chat_id,))
            carts = cursor.fetchall()
        
        if not carts:
            self.api.send_message(chat_id, "🛒 سبد خرید شما خالی است.")
            return
        
        for cart in carts:
            keyboard = {
                'inline_keyboard': [
                    [{'text': f'🛒 مشاهده سبد', 'callback_data': f'cart_{cart["store_id"]}'}]
                ]
            }
            self.api.send_message(
                chat_id,
                f"🏪 *{cart['store_name']}*\n"
                f"📦 {cart['item_count']} محصول\n"
                f"💰 {cart['total']:,} تومان",
                keyboard
            )
    
    def _start_checkout(self, chat_id: int, store_id: int):
        """Start checkout process"""
        items = self._get_cart(chat_id, store_id)
        if not items:
            self.api.send_message(chat_id, "🛒 سبد خرید شما خالی است.")
            return
        
        self._set_user_state(chat_id, 'CUSTOMER_NAME', {'store_id': store_id})
        self.api.send_message(
            chat_id,
            "📝 لطفاً نام و نام خانوادگی خود را وارد کنید:",
            self.keyboards.cancel_keyboard()
        )
    
    def _process_checkout(self, chat_id: int, data: Dict):
        """Process checkout and create order"""
        store_id = data['store_id']
        items = self._get_cart(chat_id, store_id)
        store = self._get_store_by_id(store_id)
        
        if not items:
            self.api.send_message(chat_id, "⚠️ سبد خرید خالی است.")
            return
        
        # Calculate total
        total = sum(item.price * item.quantity for item in items)
        
        # Create order number
        order_number = self._generate_order_number()
        
        # Create products JSON
        products_json = json.dumps([
            {'product_id': item.product_id, 'name': item.name, 
             'price': item.price, 'quantity': item.quantity}
            for item in items
        ])
        
        # Save order
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Insert order
            cursor.execute('''
                INSERT INTO orders (
                    order_number, customer_chat_id, store_id,
                    products_json, total_amount, status,
                    customer_name, customer_phone, customer_address, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                order_number, chat_id, store_id,
                products_json, total, 'pending',
                data.get('customer_name', ''),
                data.get('customer_phone', ''),
                data.get('customer_address', ''),
                data.get('notes', '')
            ))
            
            order_id = cursor.lastrowid
            
            # Update stock
            for item in items:
                cursor.execute('''
                    UPDATE products SET stock = stock - ? WHERE id = ?
                ''', (item.quantity, item.product_id))
        
        # Clear cart
        self._clear_cart(chat_id, store_id)
        
        # Send confirmation to customer
        self.api.send_message(
            chat_id,
            f"✅ سفارش شما با موفقیت ثبت شد!\n\n"
            f"📋 شماره سفارش: `{order_number}`\n"
            f"💰 مبلغ: {total:,} تومان\n"
            f"📊 وضعیت: در انتظار تأیید\n\n"
            f"از طریق /my_orders می‌توانید وضعیت سفارش را پیگیری کنید."
        )
        
        # Notify store owner
        if store:
            order_text = (
                f"🛒 *سفارش جدید*\n\n"
                f"📋 شماره: `{order_number}`\n"
                f"👤 مشتری: {data.get('customer_name', '-')}\n"
                f"📞 تلفن: {data.get('customer_phone', '-')}\n"
                f"📍 آدرس: {data.get('customer_address', '-')}\n\n"
                f"📦 محصولات:\n"
            )
            
            for item in items:
                order_text += f"• {item.name} x {item.quantity}\n"
            
            order_text += f"\n💰 جمع کل: {total:,} تومان"
            
            if data.get('notes'):
                order_text += f"\n\n📝 توضیحات: {data['notes']}"
            
            self.api.send_message(
                store.owner_chat_id,
                order_text,
                self.keyboards.order_actions(order_id)
            )
    
    def _handle_order_action(self, chat_id: int, callback_id: str, parts: List[str]):
        """Handle order status changes"""
        action = parts[1]  # confirm, cancel, process, ship, deliver
        order_id = int(parts[2])
        
        status_map = {
            'confirm': 'confirmed',
            'cancel': 'cancelled',
            'process': 'processing',
            'ship': 'shipped',
            'deliver': 'delivered'
        }
        
        new_status = status_map.get(action)
        if not new_status:
            return
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Update order status
            cursor.execute('''
                UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (new_status, order_id))
            
            # Get order details
            cursor.execute('''
                SELECT order_number, customer_chat_id FROM orders WHERE id = ?
            ''', (order_id,))
            order = cursor.fetchone()
        
        if order:
            status_persian = OrderStatus.get_persian(new_status)
            
            # Notify customer
            self.api.send_message(
                order['customer_chat_id'],
                f"📋 *بروزرسانی سفارش*\n\n"
                f"شماره سفارش: `{order['order_number']}`\n"
                f"وضعیت جدید: {status_persian}"
            )
            
            # Answer callback
            self.api.answer_callback_query(
                callback_id,
                f"وضعیت سفارش به «{status_persian}» تغییر یافت."
            )
    
    def _show_reports(self, chat_id: int):
        """Show basic reports to store owner"""
        store = self._get_store_by_owner(chat_id)
        if not store:
            self.api.send_message(chat_id, "⚠️ فروشگاهی یافت نشد.")
            return
        
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Total products
            cursor.execute(
                'SELECT COUNT(*) as count FROM products WHERE store_id = ?',
                (store.id,)
            )
            total_products = cursor.fetchone()['count']
            
            # Total orders
            cursor.execute('''
                SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
                FROM orders WHERE store_id = ?
            ''', (store.id,))
            orders_info = cursor.fetchone()
            
            # Today's orders
            cursor.execute('''
                SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
                FROM orders 
                WHERE store_id = ? AND date(created_at) = date('now')
            ''', (store.id,))
            today_info = cursor.fetchone()
        
        report = (
            "📊 *گزارش فروشگاه*\n\n"
            f"📦 تعداد محصولات: {total_products}\n\n"
            f"📋 کل سفارش‌ها: {orders_info['count']}\n"
            f"💰 درآمد کل: {orders_info['total']:,} تومان\n\n"
            f"📋 سفارش‌های امروز: {today_info['count']}\n"
            f"💰 درآمد امروز: {today_info['total']:,} تومان"
        )
        
        self.api.send_message(chat_id, report)
    
    def _show_store_preview(self, chat_id: int, store: Store):
        """Show how store looks to customers"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM products 
                WHERE store_id = ? AND is_available = 1 
                ORDER BY created_at DESC
                LIMIT 5
            ''', (store.id,))
            products = cursor.fetchall()
        
        text = (
            f"🏪 *{store.store_name}*\n\n"
            f"📝 {store.description or 'بدون توضیحات'}\n"
            f"📞 {store.phone or 'ثبت نشده'}\n"
            f"📍 {store.address or 'ثبت نشده'}\n\n"
        )
        
        if products:
            text += "📦 محصولات:\n"
            for p in products:
                text += f"• {p['name']} - {p['price']:,} تومان\n"
        else:
            text += "محصولی موجود نیست."
        
        self.api.send_message(chat_id, text)
    
    def _show_profile(self, chat_id: int):
        """Show customer profile"""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM customers WHERE chat_id = ?
            ''', (chat_id,))
            customer = cursor.fetchone()
            
            # Get order count
            cursor.execute('''
                SELECT COUNT(*) as count FROM orders WHERE customer_chat_id = ?
            ''', (chat_id,))
            order_count = cursor.fetchone()['count']
        
        text = (
            "👤 *پروفایل شما*\n\n"
            f"🆔 شناسه: `{chat_id}`\n"
            f"📋 تعداد سفارش‌ها: {order_count}\n"
        )
        
        self.api.send_message(chat_id, text)

# ============== Webhook Server ==============
class WebhookServer:
    """Flask-based webhook server for production"""
    
    def __init__(self, bot: StoreBot, webhook_url: str, port: int = 8443):
        self.bot = bot
        self.webhook_url = webhook_url
        self.port = port
        self.app = Flask(__name__)
        self._setup_routes()
    
    def _setup_routes(self):
        @self.app.route(f'/webhook/{Config.BALE_TOKEN}', methods=['POST'])
        def webhook():
            try:
                update = request.json
                self._process_update(update)
                return jsonify({'ok': True})
            except Exception as e:
                logger.error(f"Webhook error: {e}")
                return jsonify({'ok': False, 'error': str(e)}), 500
        
        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({'status': 'healthy'})
    
    def _process_update(self, update: Dict):
        """Process incoming update"""
        if 'message' in update:
            self.bot.handle_message(update['message'])
        elif 'callback_query' in update:
            self.bot.handle_callback(update['callback_query'])
    
    def start(self):
        """Start the webhook server"""
        # Set webhook
        full_webhook_url = f"{self.webhook_url}/webhook/{Config.BALE_TOKEN}"
        result = self.bot.api.set_webhook(full_webhook_url)
        
        if result.get('ok'):
            logger.info(f"Webhook set successfully: {full_webhook_url}")
        else:
            logger.error(f"Failed to set webhook: {result}")
        
        # Start Flask server
        self.app.run(
            host='0.0.0.0',
            port=self.port,
            debug=False
        )

# ============== Long Polling ==============
class LongPolling:
    """Long polling handler for development"""
    
    def __init__(self, bot: StoreBot):
        self.bot = bot
        self.running = False
        self.last_update_id = 0
    
    def start(self):
        """Start long polling"""
        # Delete any existing webhook
        self.bot.api.delete_webhook()
        
        self.running = True
        logger.info("Starting long polling...")
        
        while self.running:
            try:
                result = self.bot.api.get_updates(
                    offset=self.last_update_id + 1,
                    timeout=30
                )
                
                if result.get('ok'):
                    updates = result.get('result', [])
                    
                    for update in updates:
                        self.last_update_id = update['update_id']
                        
                        if 'message' in update:
                            self.bot.handle_message(update['message'])
                        elif 'callback_query' in update:
                            self.bot.handle_callback(update['callback_query'])
            
            except Exception as e:
                logger.error(f"Polling error: {e}")
                import time
                time.sleep(5)
    
    def stop(self):
        """Stop long polling"""
        self.running = False

# ============== Main Application ==============
def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Bale Store Management Bot')
    parser.add_argument('--mode', choices=['webhook', 'polling'], 
                       default='polling', help='Bot mode')
    parser.add_argument('--port', type=int, default=8443, 
                       help='Webhook server port')
    args = parser.parse_args()
    
    # Create bot instance
    bot = StoreBot(Config.BALE_TOKEN, Config.DATABASE_PATH)
    
    if args.mode == 'webhook':
        if not Config.WEBHOOK_URL:
            logger.error("WEBHOOK_URL environment variable is required for webhook mode")
            return
        
        server = WebhookServer(
            bot=bot,
            webhook_url=Config.WEBHOOK_URL,
            port=args.port
        )
        server.start()
    
    else:
        polling = LongPolling(bot)
        
        try:
            polling.start()
        except KeyboardInterrupt:
            logger.info("Stopping bot...")
            polling.stop()

if __name__ == '__main__':
    main()
