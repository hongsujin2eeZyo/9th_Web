import CartItem from './CartItem';
import { useCartStore } from '../features/cart/useCartStore';
import { useModalStore } from '../features/modal/useModalStore';

const CartList = () => {
  const { cartItems } = useCartStore();
  const { open } = useModalStore();

  return (
    <div className="flex flex-col">
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>

      <div className="flex justify-center mt-6">
        <button
          onClick={open}
          className="px-6 py-2 border border-black rounded-lg"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
};

export default CartList;