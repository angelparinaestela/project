from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import SolicitudRetiro, Banco, QrPago, Recarga, NivelVIP, NivelCompletado

Usuario = get_user_model()

# 📝 Registro de Usuario
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    repetir_contrasena = serializers.CharField(write_only=True)
    referido_por_codigo = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ('username', 'email', 'password', 'repetir_contrasena', 'referido_por_codigo')

    def validate(self, data):
        if data['password'] != data['repetir_contrasena']:
            raise serializers.ValidationError({"repetir_contrasena": "Las contraseñas no coinciden."})
        return data

    def validate_referido_por_codigo(self, value):
        try:
            referido = Usuario.objects.get(codigo_invitacion=value)
            return referido
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("El código de invitación no es válido.")

    def create(self, validated_data):
        referido = validated_data.pop('referido_por_codigo')
        validated_data.pop('repetir_contrasena')
        password = validated_data.pop('password')

        usuario = Usuario(**validated_data)
        usuario.referido_por = referido
        usuario.set_password(password)
        usuario.saldo = 10.00
        usuario.save()
        return usuario

# 👤 Perfil de Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    referido_por_username = serializers.CharField(source='referido_por.username', read_only=True)

    class Meta:
        model = Usuario
        fields = (
            'id', 'username', 'email','vip_nivel','saldo', 'rol',
            'codigo_invitacion', 'referido_por', 'referido_por_username'
        )
        read_only_fields = ('saldo', 'rol', 'referido_por', 'referido_por_username')

# 🏦 Banco
class BancoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banco
        fields = ['id', 'nombre']

# 💸 Solicitud de Retiro
class SolicitudRetiroSerializer(serializers.ModelSerializer):
    banco_nombre = serializers.StringRelatedField(source='banco', read_only=True)

    class Meta:
        model = SolicitudRetiro
        fields = ['id', 'banco', 'banco_nombre', 'numero_cuenta', 'monto', 'estado']
        read_only_fields = ['estado', 'banco_nombre']

# 💰 Recarga
class RecargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recarga
        fields = [
            'id', 'usuario', 'monto', 'imagen_voucher',
            'estado', 'codigo_transferencia', 'imagen_rechazo', 'fecha'
        ]
        read_only_fields = ['estado', 'codigo_transferencia', 'imagen_rechazo', 'fecha', 'usuario']

# 📷 QR de Pago
class QrPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = QrPago
        fields = ['id', 'nombre', 'imagen', 'activo']

# 🎖 Nivel VIP (básico con URL de QR)
class NivelVIPSerializer(serializers.ModelSerializer):
    qr_url = serializers.SerializerMethodField()

    class Meta:
        model = NivelVIP
        fields = ['nivel', 'monto', 'qr_url', 'descripcion']

    def get_qr_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.qr_imagen.url)
        return obj.qr_imagen.url

class NivelVIPConEstadoSerializer(NivelVIPSerializer):
    completado = serializers.SerializerMethodField()
    actual = serializers.SerializerMethodField()

    class Meta(NivelVIPSerializer.Meta):
        fields = NivelVIPSerializer.Meta.fields + ['completado', 'actual']

    def get_completado(self, obj):
        usuario = self.context.get('usuario')
        if usuario is None:
            return False
        return NivelCompletado.objects.filter(usuario=usuario, nivel=obj.nivel).exists()

    def get_actual(self, obj):
        usuario = self.context.get('usuario')
        if usuario is None:
            return False
        return usuario.vip_nivel == obj.nivel
