import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store'; // adjust path if needed

export const useAppDispatch: () => AppDispatch = useDispatch;
