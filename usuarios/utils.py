def actualizar_nivel_vip(usuario):
    total_recargado = sum(rec.monto for rec in usuario.recarga_set.filter(estado='real'))

    niveles = NivelVIP.objects.order_by('nivel') 
    nuevo_nivel = usuario.vip_nivel

    for nivel in niveles:
        if total_recargado >= nivel.monto and nivel.nivel > usuario.vip_nivel:
            nuevo_nivel = nivel.nivel

    if nuevo_nivel > usuario.vip_nivel:
        usuario.vip_nivel = nuevo_nivel
        usuario.save()

        # Registra en historial si aún no fue completado
        NivelCompletado.objects.get_or_create(usuario=usuario, nivel=nuevo_nivel)
        print(f"Usuario {usuario.username} subió a VIP {nuevo_nivel}")
