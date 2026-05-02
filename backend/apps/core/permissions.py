from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Normal users can read.
    Admin users can create, update, and delete.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user and request.user.is_staff