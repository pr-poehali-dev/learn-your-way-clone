import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number | null;
  onSuccess: () => void;
}

const API_URL = 'https://functions.poehali.dev/c2e6dce3-52e5-4905-84d1-d87e1d6d88c9';

export const SubscriptionModal = ({ open, onClose, studentId, onSuccess }: SubscriptionModalProps) => {
  const [promocode, setPromocode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(199);
  const [givesFullAccess, setGivesFullAccess] = useState(false);
  const { toast } = useToast();

  const validatePromocode = async () => {
    if (!promocode.trim() || !studentId) return;

    setValidating(true);

    try {
      const response = await fetch(`${API_URL}/subscription/validate-promocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promocode.trim(),
          student_id: studentId
        })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setDiscount(data.discount_percent);
        setFinalPrice(data.final_price);
        setGivesFullAccess(data.gives_full_access);
        
        toast({
          title: givesFullAccess ? 'Промокод даёт полный доступ! 🎁' : `Скидка ${data.discount_percent}%! 🎉`,
          description: givesFullAccess ? 'Активируй промокод для года бесплатного доступа!' : `Цена: ${data.final_price} ₽`,
        });
      } else {
        setDiscount(0);
        setFinalPrice(199);
        setGivesFullAccess(false);
        
        toast({
          title: 'Промокод недействителен',
          description: data.error || 'Проверь промокод и попробуй снова',
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: 'Ошибка проверки',
        description: 'Не удалось проверить промокод',
        variant: 'destructive'
      });
    } finally {
      setValidating(false);
    }
  };

  const handlePayment = async () => {
    if (!studentId) return;

    setLoading(true);

    try {
      if (givesFullAccess && promocode.trim()) {
        const response = await fetch(`${API_URL}/subscription/apply-promocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: promocode.trim(),
            student_id: studentId
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast({
            title: 'Промокод активирован! 🎉',
            description: data.message,
          });
          onSuccess();
          onClose();
          return;
        }
      }

      const paymentResponse = await fetch(`${API_URL}/subscription/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          amount: finalPrice,
          promocode: promocode.trim()
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok) {
        toast({
          title: 'Демо-оплата',
          description: 'В реальной версии здесь будет платёжная система',
        });

        setTimeout(async () => {
          const confirmResponse = await fetch(`${API_URL}/subscription/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_id: paymentData.payment_id,
              student_id: studentId
            })
          });

          const confirmData = await confirmResponse.json();

          if (confirmResponse.ok && confirmData.success) {
            toast({
              title: 'Подписка активирована! 🎉',
              description: confirmData.message,
            });
            onSuccess();
            onClose();
          }
        }, 1000);
      }
    } catch (err) {
      toast({
        title: 'Ошибка оплаты',
        description: 'Не удалось обработать платёж',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="CreditCard" size={24} className="text-orange-500" />
            Оформить подписку
          </DialogTitle>
          <DialogDescription>
            Получи полный доступ ко всем функциям приложения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border-4 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Подписка на 30 дней</span>
              {discount > 0 && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-2">
              {discount > 0 && (
                <span className="text-2xl text-gray-400 line-through">199 ₽</span>
              )}
              <span className="text-4xl font-bold text-orange-600">
                {finalPrice} ₽
              </span>
            </div>
            
            {givesFullAccess && (
              <div className="mt-3 bg-green-100 border-2 border-green-300 rounded-xl p-3">
                <p className="text-green-700 font-bold text-center">
                  🎁 Промокод даёт год бесплатного доступа!
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="promocode" className="text-base font-semibold">
              Промокод (необязательно)
            </Label>
            <div className="flex gap-2">
              <Input
                id="promocode"
                placeholder="Введи промокод..."
                value={promocode}
                onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                disabled={loading || validating}
                className="text-lg"
              />
              <Button
                onClick={validatePromocode}
                disabled={!promocode.trim() || loading || validating}
                variant="outline"
                className="px-6"
              >
                {validating ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Проверить'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Check" size={16} className="text-green-500" />
              <span>Персонализированные уроки через твои интересы</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Check" size={16} className="text-green-500" />
              <span>AI-репетитор для любых вопросов</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Check" size={16} className="text-green-500" />
              <span>Тесты и отслеживание прогресса</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Check" size={16} className="text-green-500" />
              <span>Достижения и мотивационная система</span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full text-lg py-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            size="lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Обработка...
              </>
            ) : givesFullAccess && promocode.trim() ? (
              <>
                <Icon name="Gift" size={20} className="mr-2" />
                Активировать промокод
              </>
            ) : (
              <>
                <Icon name="CreditCard" size={20} className="mr-2" />
                Оплатить {finalPrice} ₽
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
