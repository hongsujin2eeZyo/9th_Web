import { useCartStore } from '../features/cart/useCartStore';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const { amount } = useCartStore();

  return (
    <nav className="bg-zinc-700 py-4 shadow">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-2xl font-bold">Ohtani Ahn</h1>

        <div className="flex items-center gap-3 text-white">
          <FaShoppingCart size={22} />
          {amount}개
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
