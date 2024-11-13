def individual_serial(user) -> dict:
    return {
        "id": str(user["_id"]),
        "authid": user["authid"],
        "notes": user["notes"]
    }

def list_serial(users) -> list:
    return [individual_serial(user) for user in users]