from django.shortcuts import render
from heapq import heappop, heappush
from collections import deque
import heapq
import sys


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def compute(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            array = data.get('array', [])
            operation = data.get('operation', 1)
            print(request.body)
            if isinstance(array, list) and all(isinstance(sublist, list) for sublist in array):
                if operation == 1:
                    return JsonResponse({"result": dijkstra(array), operation: "dijkstra"})
                elif operation == 2:
                    return JsonResponse({"result": A_star(array), operation: "A_star"})
                elif operation == 3:
                    return JsonResponse({"result": bfs(array), operation: "bfs"})
                elif operation == 4:
                    return JsonResponse({"result": dfs(array), operation: "dfs"})
                elif operation == 5:
                    return JsonResponse({"result": bellman(array), operation: "bellman"})
                else:
                    return JsonResponse({"error": "Invalid operation."}, status=400)
            else:
                return JsonResponse({"error": "Invalid input format. Expected a 2D array of numbers."}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)
    
def dijkstra(array):
    rows = len(array)
    cols = len(array[0])
    
    start = None
    end = None
    for i in range(rows):
        for j in range(cols):
            if array[i][j] == 1:
                if start == None:
                    start = (i, j)
                else:
                    end = (i, j)
            
    
    if not start or not end:
        return None  # If start or end points are not found
    
    pq = []
    heappush(pq, (0, start))
    distances = [[sys.maxsize] * cols for _ in range(rows)]
    distances[start[0]][start[1]] = 0
    parent = [[None] * cols for _ in range(rows)]
    
    movements = [ (1, 0) , (0, 1), (-1, 0), (0, -1)]
    
    while pq:
        current_dist, (x, y) = heappop(pq)
        
        if (x, y) == end:
            break
        
        for dx, dy in movements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and array[nx][ny] != 2:  # Check boundaries and not a wall
                new_dist = current_dist + 1  # Assuming each move has a distance of 1
                
                if new_dist < distances[nx][ny]:
                    distances[nx][ny] = new_dist
                    parent[nx][ny] = (x, y)
                    heappush(pq, (new_dist, (nx, ny)))
    
    path = []
    x, y = end
    while (x, y) != start:
        path.append((x, y))
        x, y = parent[x][y]
    path.append(start)
    path.reverse()

    for (x, y) in path:
        array[x][y] = 1
    return array

def A_star(array):    
    rows = len(array)
    cols = len(array[0])
    
    start = None
    end = None
    for i in range(rows):
        for j in range(cols):
            if array[i][j] == 1:
                if start is None:
                    start = (i, j)
                else:
                    end = (i, j)
    
    if not start or not end:
        return None  # If start or end points are not found
    
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    pq = []
    heapq.heappush(pq, (0, start))
    g_score = [[sys.maxsize] * cols for _ in range(rows)]
    g_score[start[0]][start[1]] = 0
    f_score = [[sys.maxsize] * cols for _ in range(rows)]
    f_score[start[0]][start[1]] = heuristic(start, end)
    parent = [[None] * cols for _ in range(rows)]
    
    movements = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        current_f, (x, y) = heapq.heappop(pq)
        
        if (x, y) == end:
            break
        
        for dx, dy in movements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and array[nx][ny] != 2:  # Check boundaries and not a wall
                tentative_g = g_score[x][y] + 1  # Assuming each move has a distance of 1
                
                if tentative_g < g_score[nx][ny]:
                    g_score[nx][ny] = tentative_g
                    f_score[nx][ny] = tentative_g + heuristic((nx, ny), end)
                    parent[nx][ny] = (x, y)
                    heapq.heappush(pq, (f_score[nx][ny], (nx, ny)))
    
    path = []
    x, y = end
    while (x, y) != start:
        path.append((x, y))
        x, y = parent[x][y]
    path.append(start)
    path.reverse()

    for (x, y) in path:
        array[x][y] = 1
    return array


  
def bfs(array):
    rows = len(array)
    cols = len(array[0])
    
    start = None
    end = None
    for i in range(rows):
        for j in range(cols):
            if array[i][j] == 1:
                if start is None:
                    start = (i, j)
                else:
                    end = (i, j)
    
    if not start or not end:
        return None  # If start or end points are not found
    
    queue = deque([start])
    distances = [[None] * cols for _ in range(rows)]
    distances[start[0]][start[1]] = 0
    parent = [[None] * cols for _ in range(rows)]
    
    movements = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        x, y = queue.popleft()
        
        if (x, y) == end:
            break
        
        for dx, dy in movements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and array[nx][ny] != 2 and distances[nx][ny] is None:  # Check boundaries and not a wall and not visited
                distances[nx][ny] = distances[x][y] + 1
                parent[nx][ny] = (x, y)
                queue.append((nx, ny))
    
    path = []
    x, y = end
    while (x, y) != start:
        path.append((x, y))
        x, y = parent[x][y]
    path.append(start)
    path.reverse()

    for (x, y) in path:
        array[x][y] = 1
    return array


def dfs(array):
    rows = len(array)
    cols = len(array[0])
    
    start = None
    end = None
    for i in range(rows):
        for j in range(cols):
            if array[i][j] == 1:
                if start is None:
                    start = (i, j)
                else:
                    end = (i, j)
    
    if not start or not end:
        return None  # If start or end points are not found
    
    stack = [(start, [start])]
    visited = set()
    parent = [[None] * cols for _ in range(rows)]
    
    movements = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while stack:
        (x, y), path = stack.pop()
        
        if (x, y) == end:
            final_path = path
            break
        
        visited.add((x, y))
        
        for dx, dy in movements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols and array[nx][ny] != 2 and (nx, ny) not in visited:
                parent[nx][ny] = (x, y)
                stack.append(((nx, ny), path + [(nx, ny)]))
    
    if end not in visited:
        return None  # No path found
    
    for (x, y) in final_path:
        array[x][y] = 1
    return array
def bellman(array):
    rows = len(array)
    cols = len(array[0])
    
    start = None
    end = None
    for i in range(rows):
        for j in range(cols):
            if array[i][j] == 1:
                if start is None:
                    start = (i, j)
                else:
                    end = (i, j)
    
    if not start or not end:
        return None  # If start or end points are not found
    
    distances = [[sys.maxsize] * cols for _ in range(rows)]
    distances[start[0]][start[1]] = 0
    parent = [[None] * cols for _ in range(rows)]
    
    movements = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for _ in range(rows * cols - 1):
        for x in range(rows):
            for y in range(cols):
                if distances[x][y] != sys.maxsize:
                    for dx, dy in movements:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and array[nx][ny] != 2:  # Check boundaries and not a wall
                            if distances[x][y] + 1 < distances[nx][ny]:
                                distances[nx][ny] = distances[x][y] + 1
                                parent[nx][ny] = (x, y)
    
    
    if distances[end[0]][end[1]] == sys.maxsize:
        return None  
    
    path = []
    x, y = end
    while (x, y) != start:
        path.append((x, y))
        x, y = parent[x][y]
    path.append(start)
    path.reverse()

    for (x, y) in path:
        array[x][y] = 1
    return array
