import { useModalStore } from '../features/modal/useModalStore';
import { useCartStore } from '../features/cart/useCartStore';

const Modal = () => {
  const { isOpen, close } = useModalStore();
  const { clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">전체 삭제</h2>
        <p className="mb-6">장바구니의 모든 항목을 삭제하시겠습니까?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={close} className="px-4 py-2 border rounded">
            아니요
          </button>
          <button
            onClick={() => {
              clearCart();
              close();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
