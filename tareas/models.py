from django.db import models
from django.conf import settings

class Tarea(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    puntos = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_limite = models.DateField()

    def __str__(self):
        return self.titulo

class TareaAsignada(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE)
    completada = models.BooleanField(default=False)
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
