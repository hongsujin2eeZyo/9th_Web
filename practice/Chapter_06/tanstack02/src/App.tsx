import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
//import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlacehorder';
import InfinitePostsAutoJsonPlaceholder from './components/InfintePostsAutoJsonPlaceholder';


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfinitePostsAutoJsonPlaceholder />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;