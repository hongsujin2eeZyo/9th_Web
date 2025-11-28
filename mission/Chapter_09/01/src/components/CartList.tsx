import CartItem from './CartItem';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import type { RootState , AppDispatch } from '../store/store';

const CartList = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch<AppDispatch>();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">장바구니가 비어있습니다</h2>
        <p className="text-gray-500">음반을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>


      <div className="flex justify-center mt-6">
        <button
          onClick={() => dispatch(clearCart())}
          className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100 font-semibold"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
};

export default CartList;
