from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from .models import Banco, SolicitudRetiro, Recarga, QrPago, RecargaPendiente, RecargaReal, RecargaFalsa
from .models import NivelVIP
from .utils import actualizar_nivel_vip 
Usuario = get_user_model()

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'rol', 'saldo', 'is_staff', 'codigo_invitacion', 'mostrar_referido')
    search_fields = ('username', 'email', 'codigo_invitacion')
    readonly_fields = ('codigo_invitacion', 'mostrar_referido')

    fieldsets = UserAdmin.fieldsets + (
        ('Datos adicionales', {
            'fields': ('rol', 'saldo', 'codigo_invitacion', 'mostrar_referido'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Datos adicionales', {
            'fields': ('rol', 'saldo', 'codigo_invitacion', 'referido_por'),
        }),
    )

    def mostrar_referido(self, obj):
        return obj.referido_por.username if obj.referido_por else "Ninguno"
    mostrar_referido.short_description = 'Referido por'


@admin.register(Banco)
class BancoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')


@admin.register(SolicitudRetiro)
class SolicitudRetiroAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'banco', 'numero_cuenta', 'monto', 'estado')
    list_filter = ('estado', 'banco')
    search_fields = ('usuario__username', 'numero_cuenta')
    readonly_fields = ('usuario', 'banco', 'numero_cuenta', 'monto')
    list_editable = ('estado',)

    def save_model(self, request, obj, form, change):
        original = None
        if obj.pk:
            try:
                original = SolicitudRetiro.objects.get(pk=obj.pk)
            except SolicitudRetiro.DoesNotExist:
                pass

        # Si pasa de pendiente a confirmado
        if original and original.estado == 'pendiente' and obj.estado == 'confirmado':
            if obj.usuario.vip_nivel < 2:
                raise ValidationError({'estado': "El usuario debe ser al menos VIP 2 para retirar."})

            if obj.monto < 50:
                raise ValidationError({'monto': "El monto mínimo de retiro es S/50."})

            if obj.usuario.saldo < obj.monto:
                raise ValidationError({'monto': "El usuario no tiene saldo suficiente para aprobar este retiro."})

            obj.usuario.saldo -= obj.monto
            obj.usuario.save()

        super().save_model(request, obj, form, change)


@admin.register(QrPago)
class QrPagoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo')


class RecargaPendienteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'estado', 'fecha')
    readonly_fields = ('usuario', 'monto', 'imagen_voucher', 'fecha')
    fields = ('usuario', 'monto', 'imagen_voucher', 'estado', 'codigo_transferencia', 'imagen_rechazo')

    def save_model(self, request, obj, form, change):
        recarga_original = None

        if obj.pk:
            try:
                recarga_original = Recarga.objects.get(pk=obj.pk)
            except Recarga.DoesNotExist:
                pass

        if obj.estado == 'real' and not obj.codigo_transferencia:
            raise ValidationError({'codigo_transferencia': "Debes ingresar el código de transferencia para confirmar como real."})

        if obj.estado == 'falso' and not obj.imagen_rechazo:
            raise ValidationError({'imagen_rechazo': "Debes subir la imagen de rechazo para marcarlo como falso."})

        super().save_model(request, obj, form, change)

        if recarga_original and recarga_original.estado != 'real' and obj.estado == 'real':
            obj.usuario.saldo += obj.monto
            obj.usuario.save()


@admin.register(RecargaPendiente)
class AdminPendientes(RecargaPendienteAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(estado='pendiente')


@admin.register(RecargaReal)
class AdminReales(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'codigo_transferencia', 'fecha')
    readonly_fields = ('usuario', 'monto', 'imagen_voucher', 'codigo_transferencia', 'fecha')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(estado='real')

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(RecargaFalsa)
class AdminFalsos(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'fecha')
    readonly_fields = ('usuario', 'monto', 'imagen_voucher', 'imagen_rechazo', 'fecha')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(estado='falso')

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(NivelVIP)
class NivelVIPAdmin(admin.ModelAdmin):
    list_display = ('nivel', 'monto', 'qr_imagen')


class RecargaPendienteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'estado', 'fecha')
    readonly_fields = ('usuario', 'monto', 'imagen_voucher', 'fecha')
    fields = ('usuario', 'monto', 'imagen_voucher', 'estado', 'codigo_transferencia', 'imagen_rechazo')

    def save_model(self, request, obj, form, change):
        recarga_original = None
        if obj.pk:
            try:
                recarga_original = Recarga.objects.get(pk=obj.pk)
            except Recarga.DoesNotExist:
                pass

        if obj.estado == 'real' and not obj.codigo_transferencia:
            raise ValidationError({'codigo_transferencia': "Debes ingresar el código de transferencia para confirmar como real."})

        if obj.estado == 'falso' and not obj.imagen_rechazo:
            raise ValidationError({'imagen_rechazo': "Debes subir la imagen de rechazo para marcarlo como falso."})

        super().save_model(request, obj, form, change)

        # ⚠️ Solo actualizar si es la primera vez que se marca como 'real'
        if recarga_original and recarga_original.estado != 'real' and obj.estado == 'real':
            obj.usuario.saldo += obj.monto
            obj.usuario.save()

            # 🎯 Aquí actualizamos el VIP
            actualizar_nivel_vip(obj.usuario)