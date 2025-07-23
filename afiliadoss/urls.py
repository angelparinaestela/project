from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usuarios.views import QrPagoActivoView 

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API pública de autenticación JWT
    path('api/usuarios/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/usuarios/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Módulos personalizados
    path('api/usuarios/', include('usuarios.urls')),
    path('api/tareas/', include('tareas.urls')),
    path('api/admin_api/', include('admin_api.urls')),

    # Endpoint para obtener QR activo
    path('api/qr/', QrPagoActivoView.as_view(), name='qr-activo'),

]

# 👉 Esto permite servir archivos de media (como el QR) en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
