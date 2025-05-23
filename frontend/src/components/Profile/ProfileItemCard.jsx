import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import matchesService from "@/services/matches.services";
import { useSelector } from "react-redux";
import { setUserRelatedItems } from "@/store/user.slice";
import itemsService from "@/services/items.services";
import { useDispatch } from "react-redux";

export function ProfileItemCard({ item }) {
  const [open, setOpen] = useState(false);
  const [matchingItems, setMatchingItems] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleItemAction = () => {
    if (item.itemType === "found") {
      // Navigate to the item detail page for found items
      navigate(`/items/${item._id}`);
    } else {
      // Open dialog for lost items
      setOpen(true);
    }
  };
  const userId = useSelector((state) => state.user.userData._id);
  
  // Function to handle the confirmation of item reunion
  if(item.status === "Pending" && item.itemType === "lost") {
    useEffect(() => {
      ;( async () => {
        const response = await matchesService.getMatches(item._id);
        if(response?.matches?.length > 0){
          console.log("Matches found:", response.matches);
          setMatchingItems(response.matches);
        }
        else {
          const response = await matchesService.createMatches(item._id);
          if(response?.matches > 0 && response?.message === "New matches created"){
            const newResponse = await matchesService.getMatches(item._id);
            console.log("New matches created:", newResponse);
            if(newResponse?.matches?.length > 0){
              setMatchingItems(newResponse.matches);
            }
          }
        }
      })();
    } , [item]);
  }


  // Function to handle the confirmation of item reunion
  const handleConfirm = async (matchId , foundItemId) => {
    try {
      const response = await matchesService.updateMatchStatus(matchId, foundItemId);
      if(response?.message === "Match status updated successfully"){
        const response = await itemsService.getUserItems(userId);
        if(response?.items){
          dispatch(setUserRelatedItems(response.items));
          setOpen(false);
        }
      }
    } catch (error) {
      
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <Badge
          variant={
            item.itemType === "lost"
              ? "destructive"
              : item.itemType === "found"
              ? "success"
              : "default"
          }
          className={`absolute top-2 left-2 ${
            item.itemType === "found" ? "bg-green-100 text-green-800" : ""
          }`}
        >
          {item.itemType === "lost"
            ? "Lost"
            : item.itemType === "found"
            ? "Found"
            : "Reunited"}
        </Badge>
      </div>
      <div className="p-4 flex justify-between">
        <div>
          <h3 className="font-medium">{item.itemName}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        {item.status === "Pending" && (
          <>
            {item.itemType === "lost" ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleItemAction}>
                    Confirm Reunited
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Confirm Item Reunion</DialogTitle>
                    <DialogDescription>
                      Select the person you reunited with to get your item back
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4 space-y-3">
                    {matchingItems.map(match => (
                      <Card key={match?._id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center">
                            <div className="p-4 flex-1 flex items-center gap-3">
                              <img 
                                src={match?.images[0]} 
                                alt={match?.itemName}
                                className="w-16 h-16 rounded object-cover" 
                              />
                              <div>
                                <h5 className="font-medium">{match?.itemName}</h5>
                                <p className="text-sm">Found by {match?.user?.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(match?.matchedAt.split("T")[0]).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <Button 
                                size="sm"
                                onClick={() => handleConfirm(match._id , match.foundItemId)}
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {matchingItems.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No potential matches found.</p>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={handleItemAction}>
                Find Owner
              </Button>
            )}
          </>
        )}
        {item.status === "Resolved" && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Claimed
          </Badge>
        )}
      </div>
    </div>
  );
}