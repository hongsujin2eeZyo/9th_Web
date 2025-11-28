import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';
import type { CartItem as CartItemType } from '../features/cart/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleIncrease = () => {
    dispatch(increase(item.id));
  };

  const handleDecrease = () => {
    dispatch(decrease(item.id));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  return (
    <li className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
      <img
        src={item.img}
        alt={item.title}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.singer}</p>
        <p className="text-lg font-bold ">
          ${parseInt(item.price).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold text-gray-800">
            {item.amount}
          </span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
