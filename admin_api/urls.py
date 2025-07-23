from django.urls import path, include

from .views import AgregarSaldoView, CrearTareaView

urlpatterns = [
    path('agregar_saldo/<int:id>/', AgregarSaldoView.as_view(), name='agregar_saldo'),
    path('crear_tarea/', CrearTareaView.as_view(), name='crear_tarea'),
    path('api/usuarios/', include('usuarios.urls')),
]
