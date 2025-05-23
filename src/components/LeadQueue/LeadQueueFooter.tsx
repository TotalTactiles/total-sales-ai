
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const LeadQueueFooter: React.FC = () => {
  return (
    <CardFooter className="flex justify-between pt-2">
      <Button variant="outline" size="sm" className="text-salesBlue">View All Leads</Button>
      <Button variant="default" size="sm" className="bg-salesCyan hover:bg-salesCyan-dark">
        <Phone className="h-3.5 w-3.5 mr-1.5" />
        Auto-Dial Queue
      </Button>
    </CardFooter>
  );
};

export default LeadQueueFooter;
