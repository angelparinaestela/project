from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Recarga
from django.db import transaction

@receiver(post_save, sender=Recarga)
def actualizar_saldo_si_recarga_real(sender, instance, created, **kwargs):
    # Solo si la recarga ya existía (no es nueva) y el estado es REAL
    if not created and instance.estado == 'real':
        usuario = instance.usuario

        # ⚠️ Verificamos que no se haya sumado antes
        if not instance.codigo_transferencia:
            return  # sin código no se permite

        # ⚠️ Evitar duplicidad de saldo
        from .models import Recarga
        ya_sumada = Recarga.objects.filter(
            usuario=usuario,
            estado='real',
            codigo_transferencia=instance.codigo_transferencia,
            id__lt=instance.id
        ).exists()

        if not ya_sumada:
            usuario.saldo += instance.monto
            usuario.save()
