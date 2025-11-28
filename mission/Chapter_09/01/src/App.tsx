import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Modal from './components/Modal';

function App() {
  return (
    <Provider store={store}>  
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <CartList />
        </main>
        <Modal />
      </div>
    </Provider>
  );
}

export default App;
