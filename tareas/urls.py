from django.urls import path
from .views import ListaTareasAsignadasView

urlpatterns = [
    path('asignadas/', ListaTareasAsignadasView.as_view(), name='tareas_asignadas'),
]
