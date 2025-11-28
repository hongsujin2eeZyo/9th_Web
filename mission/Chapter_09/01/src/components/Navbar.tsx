import { useSelector, useDispatch } from 'react-redux';
import type { RootState , AppDispatch } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const amount = useSelector((state: RootState) => state.cart.amount);

  const handleClearCart = () => {
    dispatch(clearCart());
  };


return (
    <nav className="bg-zinc-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Ohtani Ahn</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
             
              <div className="text-right flex items-center gap-3 ">
                <FaShoppingCart size={22} className="text-white" />
                <p className="text-xl font-bold text-white">{amount}개</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
