<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incident;

class IncidentController extends Controller
{
    // Afficher tous les incidents
    public function index()
{
    $incidents = Incident::all();

    $incidents->transform(function ($incident, $key) {
        $incident->visible = $incident->visible ? 'OUI' : 'NON';
        return $incident;
    });

    return response()->json($incidents);
}

    // Créer un nouvel incident
    public function store(Request $request)
    {
        $incident = Incident::create($request->all());

        return response()->json($incident, 201);
    }

    // Afficher un seul incident
    public function show($id)
    {
        $incident = Incident::findOrFail($id);

        return response()->json($incident);
    }

    // Mettre à jour un incident
    public function update(Request $request, $id)
    {
        $incident = Incident::findOrFail($id);
        $incident->update($request->all());

        return response()->json($incident, 200);
    }

    // Supprimer un incident
    public function destroy($id)
    {
        Incident::destroy($id);

        return response()->json(null, 204);
    }
}
