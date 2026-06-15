from pydantic import BaseModel, Field

class CopilotRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The user query for the copilot")

class ShipmentUpdateWebhook(BaseModel):
    order_id: str = Field(..., description="The ID of the order")
    status: str = Field(..., description="The status of the shipment")
    reason: str = Field(..., description="Reason for the status update")
