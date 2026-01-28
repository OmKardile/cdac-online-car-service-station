import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requiredRole = null) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (requiredRole && role !== requiredRole) {
      router.push('/login');
    }
  }, [requiredRole, router]);
}
