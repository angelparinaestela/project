from rest_framework import generics, permissions
from .models import TareaAsignada
from .serializers import TareaAsignadaSerializer

class ListaTareasAsignadasView(generics.ListAPIView):
    serializer_class = TareaAsignadaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TareaAsignada.objects.filter(usuario=self.request.user)
