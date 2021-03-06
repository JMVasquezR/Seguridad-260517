from django.http import JsonResponse
from .serializer import *
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from .models import ProyectosSiga
from proyectos.models import Modulo
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .forms import *
from django.utils.text import slugify

from django.views import View

from django.core.files.storage import FileSystemStorage


# Create your views here.
class ProyectoViewSet(viewsets.ModelViewSet):
    serializer_class = ProyectoSerializer
    queryset = Proyecto.objects.all()


class ProyectoSistemaViewSet(viewsets.ModelViewSet):
    serializer_class = ProyectosSistemasSerializer
    queryset = ProyectoSistema.objects.all()


class DetailProyectoSistemaViewSet(viewsets.ModelViewSet):
    serializer_class = ProyectosSistemasSerializer
    queryset = ProyectoSistema.objects.all()


class ReadProyectoSistemaViewSet(generics.ListAPIView):
    serializer_class = ProyectosSistemasSerializer

    def get_queryset(self):
        id_sistema = self.kwargs['id_sistema']
        id_proyecto = self.kwargs['id_proyecto']
        return ProyectoSistema.objects.filter(proyectos=id_proyecto, sistemas=id_sistema)


class SistemasbyProyectoViewSet(viewsets.ModelViewSet):
    serializer_class = SistemasxProyectoSerializer
    queryset = Proyecto.objects.all()


class MYMProyectoSistemaViewSet(viewsets.ModelViewSet):
    serializer_class = MYMProyectoSistemaSerializer
    queryset = ProyectoSistema.objects.all()


class UploadView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(UploadView, self).dispatch(*args, **kwargs)

    def post(self, request, id=None):
        myfile = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        pj = ProyectoSistema.objects.get(pk=id)
        pj.presentation_image = filename
        pj.save()
        return JsonResponse({'msg': True})


class ProyectosApi:
    def getProyectosSiga(request):
        proyectos = list(Proyecto.objects.values_list('id_siga', flat=True))
        proyectos_disponibles = ProyectosSiga.objects.using('consecucion').exclude(id__in=proyectos).values()

        return JsonResponse(list(proyectos_disponibles), safe=False)

    def saveProyectoSistema(request):
        id_proyecto = request.POST['id_proyecto']
        id_sistemas = request.POST.getlist('id_sistemas[]')
        bulk = []

        for i in id_sistemas:
            proyecto_sistema = ProyectoSistema(sistemas=Sistema.objects.get(pk=i),
                                               proyectos=Proyecto.objects.get(pk=id_proyecto))
            bulk.append(proyecto_sistema)
        ProyectoSistema.objects.bulk_create(bulk)
        for i in id_sistemas:
            proyecto_sistema = ProyectoSistema.objects.get(sistemas=Sistema.objects.get(pk=i),
                                                           proyectos=Proyecto.objects.get(pk=id_proyecto))
            lastps = proyecto_sistema.id
            modulo = Modulo(proyectosistema=proyecto_sistema, nombre=proyecto_sistema.sistemas.nombre,
                            descripcion=proyecto_sistema.sistemas.descripcion,
                            slug=slugify(proyecto_sistema.sistemas.nombre),
                            codigo=slugify(proyecto_sistema.sistemas.nombre), is_padre=1)
            modulo.save()

        return JsonResponse(lastps, safe=False)


class AdminProyectoSistema(generics.ListAPIView):
    def post(self, request, addordelete):
        proyectosistema = request.POST['proyectosistema']
        usuario = request.POST['usuario']
        if addordelete == 1 or addordelete == '1':
            pj = AdministradoresProyectoSistema(proyectosistema_id=proyectosistema, usuario_id=usuario)
            pj.save()
        elif addordelete == 2 or addordelete == '2':
            AdministradoresProyectoSistema.objects.filter(proyectosistema_id=proyectosistema,
                                                          usuario_id=usuario).delete()

        return JsonResponse({'msg': 'Hecho'})
