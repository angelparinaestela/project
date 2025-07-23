from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegistroView,
    MiPerfilView,
    LoginView,
    MisReferidosView,
    BancoListView,
    CrearSolicitudRetiroView,
    MisRetirosView,
    MisRecargasView,
    SubirRecargaView,
    QrPagoActivoView,
    AprobarRecargaView,
    NivelesVIPDisponibles,  
    obtener_usuario_actual,
)

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('perfil/', MiPerfilView.as_view(), name='perfil'),
    path('referidos/', MisReferidosView.as_view(), name='mis-referidos'),
    path('bancos/', BancoListView.as_view(), name='banco-list'),
    path('recargas/aprobar/<int:pk>/', AprobarRecargaView.as_view(), name='aprobar_recarga'),
    path('retiros/', CrearSolicitudRetiroView.as_view(), name='crear-retiro'),
    path('mis-retiros/', MisRetirosView.as_view(), name='mis-retiros'),
    path('recargar/', SubirRecargaView.as_view(), name='subir-voucher'),
    path('mis-recargas/', MisRecargasView.as_view(), name='mis-recargas'),  # ✅ Correcto

    path('niveles-vip/', NivelesVIPDisponibles.as_view(), name='niveles-vip'),  
     path('me/', obtener_usuario_actual, name='usuario-actual'),
]
