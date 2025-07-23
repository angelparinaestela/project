from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import random
import string

# -------------------- Usuario Personalizado --------------------

class Usuario(AbstractUser):
    codigo_invitacion = models.CharField(max_length=10, unique=True)
    referido_por = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='referidos')
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rol = models.CharField(max_length=10, choices=[('usuario', 'Usuario'), ('admin', 'Administrador')], default='usuario')
    vip_nivel = models.IntegerField(default=0)  # Nivel VIP actual del usuario

    def save(self, *args, **kwargs):
        if not self.codigo_invitacion:
            self.codigo_invitacion = self.generar_codigo_unico()
        super().save(*args, **kwargs)

    def generar_codigo_unico(self):
        while True:
            base = self.username.upper()[:4]
            aleatorio = ''.join(random.choices(string.digits, k=4))
            codigo = base + aleatorio
            if not Usuario.objects.filter(codigo_invitacion=codigo).exists():
                return codigo

# -------------------- Niveles VIP --------------------

class NivelVIP(models.Model):
    nivel = models.IntegerField(unique=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    qr_imagen = models.ImageField(upload_to='qrs/')
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return f"VIP {self.nivel}"

class NivelCompletado(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nivel = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'nivel')



class Banco(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class SolicitudRetiro(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    banco = models.ForeignKey(Banco, on_delete=models.PROTECT)
    numero_cuenta = models.CharField(max_length=50)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=[('pendiente', 'Pendiente'), ('confirmado', 'Confirmado')],
        default='pendiente'
    )

    def __str__(self):
        return f"Retiro de {self.usuario.username} por S/ {self.monto} ({self.estado})"



class Recarga(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('real', 'Pago Real'),
        ('falso', 'Pago Falso'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2, default=15.00)
    imagen_voucher = models.ImageField(upload_to='vouchers/')
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    codigo_transferencia = models.CharField(max_length=100, blank=True, null=True)
    imagen_rechazo = models.ImageField(upload_to='rechazos/', blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - S/ {self.monto} - {self.estado}"

# -------------------- QR de Pago --------------------

class QrPago(models.Model):
    nombre = models.CharField(max_length=100, default="QR Yape")
    imagen = models.ImageField(upload_to='qr_pagos/')
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

# -------------------- Proxies para Filtrado en Admin --------------------

class RecargaPendiente(Recarga):
    class Meta:
        proxy = True
        verbose_name = "Recarga Pendiente"
        verbose_name_plural = "Recargas Pendientes"

class RecargaReal(Recarga):
    class Meta:
        proxy = True
        verbose_name = "Pago Real"
        verbose_name_plural = "Pagos Reales"

class RecargaFalsa(Recarga):
    class Meta:
        proxy = True
        verbose_name = "Pago Falso"
        verbose_name_plural = "Pagos Falsos"
