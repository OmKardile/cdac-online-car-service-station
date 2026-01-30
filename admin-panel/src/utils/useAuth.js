import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requiredRole = null) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log("useAuth check - token:", !!token, "role:", role, "required:", requiredRole);

    if (!token) {
      console.log("No token, redirecting to login");
      router.push('/login');
      return;
    }

    if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
      console.log(`Role mismatch: stored="${role}" !== required="${requiredRole}"`);
      // TEMPORARY: Disabled for debugging
      // router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredRole]);
}
