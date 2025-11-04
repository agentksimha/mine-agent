def evaluate_rules(data):
    """
    Dummy compliance check for demonstration.
    Replace with your real safety logic or data queries.
    """
    incidents = data.get("incidents", 0)
    gas_level = data.get("methane_ppm", 0)
    if gas_level > 5000:
        return "⚠️ Methane concentration exceeds 5000 ppm. Schedule ventilation inspection."
    elif incidents > 3:
        return "⚠️ Multiple incidents reported. Schedule safety audit."
    else:
        return "✅ All parameters within safe limits."
