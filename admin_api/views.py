from rest_framework import generics, permissions, status
from rest_framework.response import Response
from usuarios.models import Usuario
from tareas.models import Tarea, TareaAsignada
from tareas.serializers import TareaSerializer
from .permissions import EsAdmin

class ListaUsuariosAdminView(generics.ListAPIView):
    permission_classes = [EsAdmin]
    queryset = Usuario.objects.all()
    serializer_class = TareaSerializer  # Puedes crear otro serializer para usuarios si quieres

class AgregarSaldoView(generics.UpdateAPIView):
    permission_classes = [EsAdmin]
    queryset = Usuario.objects.all()
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        usuario = self.get_object()
        saldo_a_agregar = request.data.get('saldo')
        if saldo_a_agregar is None:
            return Response({'error': 'Debe enviar saldo'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            saldo_a_agregar = float(saldo_a_agregar)
        except ValueError:
            return Response({'error': 'Saldo inválido'}, status=status.HTTP_400_BAD_REQUEST)
        usuario.saldo += saldo_a_agregar
        usuario.save()
        return Response({'mensaje': f'Saldo actualizado. Nuevo saldo: {usuario.saldo}'})

class CrearTareaView(generics.CreateAPIView):
    permission_classes = [EsAdmin]
    serializer_class = TareaSerializer
