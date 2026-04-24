declare global {
  interface Window {
    ym?: (counterId: number, action: string, target?: string, params?: Record<string, unknown>) => void;
  }
}

const COUNTER_ID = 101026698;

/**
 * Отправляет цель в Яндекс.Метрику.
 * Безопасно вызывать даже если метрика ещё не загрузилась — проверяет наличие ym.
 */
export function reachGoal(target: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      window.ym(COUNTER_ID, 'reachGoal', target, params);
    }
  } catch {
    /* no-op */
  }
}

export const Goals = {
  ContactFormSubmit: 'contact_form_submit',
  ContactFormSuccess: 'contact_form_success',
  PriceRequestOpen: 'price_request_open',
  PriceRequestSubmit: 'price_request_submit',
  PriceRequestSuccess: 'price_request_success',
  PhoneClick: 'phone_click',
  EmailClick: 'email_click',
  RouteClick: 'route_click',
} as const;
