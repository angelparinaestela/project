from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from .models import NivelCompletado
from .serializers import (
    RegistroSerializer, 
    UsuarioSerializer, 
    SolicitudRetiroSerializer, 
    BancoSerializer,
    RecargaSerializer,
    QrPagoSerializer,
    NivelVIPConEstadoSerializer
)

from .models import (
    SolicitudRetiro, 
    Banco, 
    Recarga, 
    QrPago, 
    NivelVIP
)

Usuario = get_user_model()

# 📝 Registro de usuario
class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({'mensaje': 'Usuario registrado correctamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 👤 Perfil del usuario autenticado
class MiPerfilView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# 🔐 Login con JWT
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]  # Asegura acceso sin autenticación

# 👥 Ver referidos del usuario autenticado
class MisReferidosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        referidos = Usuario.objects.filter(referido_por=request.user)
        serializer = UsuarioSerializer(referidos, many=True)
        return Response(serializer.data)

# 🏦 Listar bancos disponibles
class BancoListView(generics.ListAPIView):
    queryset = Banco.objects.all()
    serializer_class = BancoSerializer
    permission_classes = [permissions.AllowAny]

# 💸 Crear solicitud de retiro
class CrearSolicitudRetiroView(generics.CreateAPIView):
    serializer_class = SolicitudRetiroSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# 📋 Ver mis retiros
class MisRetirosView(generics.ListAPIView):
    serializer_class = SolicitudRetiroSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SolicitudRetiro.objects.filter(usuario=self.request.user)

# 📤 Subir comprobante de recarga
class SubirRecargaView(generics.CreateAPIView):
    serializer_class = RecargaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# 🧾 Obtener QR de pago activo
class QrPagoActivoView(APIView):
    def get(self, request):
        qr = QrPago.objects.filter(activo=True).order_by('-id').first()
        if qr:
            return Response({
                'nombre': qr.nombre,
                'url': request.build_absolute_uri(qr.imagen.url)
            })
        return Response({'error': 'No hay QR disponible'}, status=404)

# 🧱 Niveles VIP disponibles y estado actual
class NivelesVIPDisponibles(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        niveles = NivelVIP.objects.all().order_by('nivel')
        serializer = NivelVIPConEstadoSerializer(
            niveles, 
            many=True, 
            context={'request': request, 'usuario': request.user}
        )
        return Response(serializer.data)
    
   

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    usuario = request.user
    data = {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "vip_nivel": usuario.vip_nivel,
        # Agrega más campos si los necesitas
    }
    return Response(data)


class AprobarRecargaView(APIView):
    permission_classes = [permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        try:
            recarga = Recarga.objects.select_related('usuario').get(pk=pk, estado='pendiente')
        except Recarga.DoesNotExist:
            return Response({'error': 'Recarga no encontrada o ya procesada'}, status=404)

        usuario = recarga.usuario
        monto = recarga.monto

        # 1. Aprobar recarga
        recarga.estado = 'real'
        recarga.save()

        # 2. Sumar saldo
        usuario.saldo += monto

        # 3. Actualizar VIP según monto
        nuevo_nivel = None
        if monto == 15:
            nuevo_nivel = 1
        elif monto == 35:
            nuevo_nivel = 2
        elif monto == 50:
            nuevo_nivel = 3
        elif monto == 100:
            nuevo_nivel = 4
        elif monto in [300, 500]:
            nuevo_nivel = 5

        if nuevo_nivel and usuario.vip_nivel < nuevo_nivel:
            usuario.vip_nivel = nuevo_nivel

            # Registrar como completado si aún no existe
            NivelCompletado.objects.get_or_create(usuario=usuario, nivel=nuevo_nivel)

        usuario.save()

        return Response({'mensaje': 'Recarga aprobada y VIP actualizado.'}, status=200)


class MisRecargasView(generics.ListAPIView):
    serializer_class = RecargaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recarga.objects.filter(usuario=self.request.user).order_by('-id')
    
# 📦 Esta API se conecta con el servicio Angular:
# import { HttpClient } from '@angular/common/http';
# import { Injectable } from '@angular/core';
# import { Observable } from 'rxjs';
#
# @Injectable({
#   providedIn: 'root'
# })
# export class NivelVipService {
#   private apiUrl = 'http://localhost:8000/api/niveles-vip/';
#   constructor(private http: HttpClient) {}
#
#   obtenerNiveles(): Observable<any> {
#     return this.http.get<any>(this.apiUrl);
#   }
# }
