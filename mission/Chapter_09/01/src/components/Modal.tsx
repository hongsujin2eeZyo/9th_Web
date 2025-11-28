import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  // 디버깅용 로그
  console.log('Modal isOpen:', isOpen);
  console.log('Modal 렌더링됨');

  if (!isOpen) {
    console.log('모달이 닫혀있어서 null 반환');
    return null;
  }
  
  console.log('모달 렌더링 시작!');

  const handleNo = () => {
    console.log('아니요 클릭');
    dispatch(closeModal());
  };

  const handleYes = () => {
    console.log('네 클릭');
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 오버레이 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={handleNo}
      />
      
      {/* 모달 */}
      <div 
        style={{ 
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          maxWidth: '28rem',
          width: '100%',
          margin: '0 1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          전체 삭제
        </h2>
        <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
          장바구니의 모든 항목을 삭제하시겠습니까?
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNo}
            style={{
              padding: '0.5rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            아니요
          </button>
          <button
            onClick={handleYes}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

