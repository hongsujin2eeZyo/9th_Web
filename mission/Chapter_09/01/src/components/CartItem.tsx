import type { CartItem as CartItemType } from '../features/cart/useCartStore';
import { useCartStore } from '../features/cart/useCartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { increase, decrease } = useCartStore();

  return (
    <li className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
      <img src={item.img} className="w-24 h-24 object-cover rounded-lg" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.singer}</p>
        <p className="text-lg font-bold">
          ${parseInt(item.price).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => decrease(item.id)}
          className="w-8 h-8 bg-gray-200 rounded-full"
        >
          -
        </button>
        <span className="w-8 text-center">{item.amount}</span>
        <button
          onClick={() => increase(item.id)}
          className="w-8 h-8 bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
    </li>
  );
};

export default CartItem;
