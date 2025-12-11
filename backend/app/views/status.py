from pyramid.view import view_config


@view_config(route_name="status", request_method="GET", renderer="json")
def status(request):
    """Health check endpoint to verify frontend-backend connection."""
    return {
        "status": "ok",
        "message": "Server is running",
        "version": "1.0.0",
    }