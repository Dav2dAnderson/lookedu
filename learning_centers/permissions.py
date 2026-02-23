from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in SAFE_METHODS:
            return True
        
        elif request.method in ['PUT', ]:
            return user.is_staff
        
        return obj.owner_id == user.id

class IsEduOwner(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method == "POST":
            return request.user.role and request.user.role.name == 'edu_owner'
        
        return True

        