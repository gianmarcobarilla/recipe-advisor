import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { App } from './App.tsx'
import { fetchIngredients, fetchAreas } from './services/mealdb'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
    },
  },
})

// Prefetch on startup so the wizard has no loading state for these lists
void queryClient.prefetchQuery({
  queryKey: ['ingredients'],
  queryFn: fetchIngredients,
  staleTime: Infinity,
})
void queryClient.prefetchQuery({
  queryKey: ['areas'],
  queryFn: fetchAreas,
  staleTime: Infinity,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
