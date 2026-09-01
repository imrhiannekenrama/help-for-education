import { supabase } from './supabase';
import { CheckoutFormValues } from './validations';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  version: string;
  rating: number;
  reviewsCount: number;
  tagline: string;
  description: string;
  gcashNumber: string;
  gcashAccountName: string;
}

export const TEACHER_BUNDLE_PRODUCT: Product = {
  id: 'teacher-ultimate-bundle',
  name: 'Teacher Ultimate Bundle',
  price: 99,
  originalPrice: 1499,
  version: 'v2.5 Updated 2026',
  rating: 4.9,
  reviewsCount: 1240,
  tagline: 'All-in-one DepEd compliant automated lesson planning, grading sheets, and classroom tools for Filipino Educators.',
  description: 'Streamline your teaching tasks with over 500+ ready-to-use templates, automated grading tools, DepEd Form 137/138 automators, and interactive lesson presentation packs designed specifically for Philippine teachers.',
  gcashNumber: '0917-888-9922',
  gcashAccountName: 'HELP FOR EDUCATION INC.',
};

export interface CheckoutRecord {
  id?: string;
  productId: string;
  productName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  gcashRef: string;
  paymentProofUrl?: string | null;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

/**
 * Stores checkout request in Supabase 'checkouts' table with status 'pending'
 */
export async function createCheckout(data: CheckoutFormValues, productId: string = 'teacher-ultimate-bundle'): Promise<{ id: string; reference: string }> {
  const reference = data.gcashRef.replace(/\s+/g, '');
  const checkoutData = {
    product_id: productId,
    product_name: TEACHER_BUNDLE_PRODUCT.name,
    amount: TEACHER_BUNDLE_PRODUCT.price,
    customer_name: data.name,
    customer_email: data.email,
    gcash_ref: reference,
    payment_proof_url: null,
    status: 'pending',
  };

  try {
    const { data: inserted, error } = await supabase
      .from('checkouts')
      .insert(checkoutData)
      .select()
      .single();

    if (error) throw error;
    return { id: inserted.id, reference };
  } catch (error) {
    console.warn('Supabase checkout submission fallback:', error);
  }

  // Fallback — store in localStorage if DB not available
  const fallbackId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('hfe_checkouts') || '[]');
    localStorage.setItem('hfe_checkouts', JSON.stringify([...existing, { ...checkoutData, id: fallbackId, createdAt: new Date().toISOString() }]));
  }
  return { id: fallbackId, reference };
}

export async function getProductById(id: string): Promise<Product> {
  return TEACHER_BUNDLE_PRODUCT;
}
