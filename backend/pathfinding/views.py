from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def computePath(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            array = data.get('array', [])
            algo = data.get('algorithm', 1)

            if isinstance(array, list) and all(isinstance(sublist, list) for sublist in array):
                if algo == 1:
                    #djiktra(array)
                    return JsonResponse({"result": 200})
                elif algo == 2:
                    #A*(array)
                    return JsonResponse({"result": 200})
                elif algo == 3:
                    #dfs(array)
                    return JsonResponse({"result": 200})
                elif algo == 4:
                    #bfs(array)
                    return JsonResponse({"result": 200})
                elif algo == 5:
                    #bellman(array)
                    return JsonResponse({"result": 200})
                
                else:
                    return JsonResponse({"error": "Invalid algo"}, status=400)
            else:
                return JsonResponse({"error": "Invalid input format. Expected a 2D array of numbers."}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)