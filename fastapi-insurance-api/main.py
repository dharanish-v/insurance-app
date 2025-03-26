from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Insurance Policies API",
    description="API for searching and filtering insurance policies",
    version="1.0.0"
)

# Add CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Policy model using Pydantic for validation
class Policy(BaseModel):
    id: int
    name: str
    type: str
    premium: int
    coverage: int

# Initial dataset of insurance policies
POLICIES = [
    {
        "id": 1,
        "name": "Secure Future Term Life",
        "type": "Term Life",
        "premium": 5000,
        "coverage": 1000000
    },
    {
        "id": 2,
        "name": "Health Shield Plan",
        "type": "Health",
        "premium": 3000,
        "coverage": 500000
    },
    {
        "id": 3,
        "name": "Car Protect Plan",
        "type": "Vehicle",
        "premium": 2000,
        "coverage": 300000
    },
    {
        "id": 4,
        "name": "Family Guardian Insurance",
        "type": "Term Life",
        "premium": 4500,
        "coverage": 750000
    },
    {
        "id": 5,
        "name": "Wellness Complete Health",
        "type": "Health",
        "premium": 3500,
        "coverage": 600000
    }
]

@app.get("/api/policies", response_model=List[Policy])
async def get_policies(
    name: Optional[str] = Query(None, description="Search policies by name (case-insensitive)"),
    type: Optional[str] = Query(None, description="Filter by policy type"),
    min_premium: Optional[int] = Query(None, description="Minimum premium amount"),
    max_premium: Optional[int] = Query(None, description="Maximum premium amount"),
    min_coverage: Optional[int] = Query(None, description="Minimum coverage amount"),
    sort: Optional[str] = Query(None, description="Sort by premium (asc/desc)")
) -> List[Policy]:
    """
    Retrieve and filter insurance policies with multiple optional parameters.
    
    - **name**: Partial name search (case-insensitive)
    - **type**: Filter by specific policy type
    - **min_premium**: Filter policies with premium above this value
    - **max_premium**: Filter policies with premium below this value
    - **min_coverage**: Filter policies with coverage above this value
    - **sort**: Sort policies by premium (ascending or descending)
    """
    # Start with full policy list
    results = POLICIES.copy()
    
    # Name search (case-insensitive, partial match)
    if name:
        results = [
            policy for policy in results 
            if name.lower() in policy['name'].lower()
        ]
    
    # Policy type filter
    if type:
        results = [
            policy for policy in results 
            if policy['type'] == type
        ]
    
    # Minimum premium filter
    if min_premium is not None:
        results = [
            policy for policy in results 
            if policy['premium'] >= min_premium
        ]
    
    # Maximum premium filter
    if max_premium is not None:
        results = [
            policy for policy in results 
            if policy['premium'] <= max_premium
        ]
    
    # Minimum coverage filter
    if min_coverage is not None:
        results = [
            policy for policy in results 
            if policy['coverage'] >= min_coverage
        ]
    
    # Sorting
    if sort == 'asc':
        results = sorted(results, key=lambda x: x['premium'])
    elif sort == 'desc':
        results = sorted(results, key=lambda x: x['premium'], reverse=True)
    
    return results

@app.get("/api/policy-types")
async def get_policy_types():
    """
    Retrieve unique policy types available in the system.
    """
    return list(set(policy['type'] for policy in POLICIES))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
