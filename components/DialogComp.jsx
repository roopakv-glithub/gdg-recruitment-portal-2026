"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { CiWarning } from "react-icons/ci";

import CarouselComp from "./CarouselComp";
import { toast } from "sonner";

export default function DialogComp({ selectedApplicants }) {
    const [shortlistStatus, setShortlistStatus] = useState([]);

    // Initialize the shortlist status when the component loads
    useEffect(() => {
        const status = selectedApplicants().map(applicant => applicant.shortlisted);
        setShortlistStatus(status);
    }, [selectedApplicants]);

    const handleShortlist = async (index) => {
        const applicant = selectedApplicants()[index];
        const isShortlisted = shortlistStatus[index];

        try {
            const res = await fetch(`/api/shortlist/${applicant._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shortlisted: !isShortlisted }),
            });

            if (res.ok) {
                const updatedStatus = [...shortlistStatus];
                updatedStatus[index] = !isShortlisted;
                setShortlistStatus(updatedStatus);
                toast.success(`Applicant has been ${!isShortlisted ? 'shortlisted' : 'unshortlisted'}!`);
            } else {
                console.error("Failed to update applicant status.");
                throw new Error("Failed to update");
            }
        } catch (error) {
            console.error("Error occurred while updating the status:", error.message);
            toast.error("Failed to update status");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Responses</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] h-fit">
                <DialogHeader>
                    <DialogTitle>Applicant&apos;s Responses</DialogTitle>
                    <DialogDescription>
                        Questions and answers answered by the applicants can be viewed here.
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                    {selectedApplicants().length !== 0 ? (
                        <CarouselComp    
                            dataList={selectedApplicants()} 
                            handleShortlist={handleShortlist} 
                            shortlistStatus={shortlistStatus}
                        />
                    ) : (
                        <p className="flex gap-3 items-center justify-start font-light text-md text-red-500">
                            <CiWarning /> No applicant selected
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
