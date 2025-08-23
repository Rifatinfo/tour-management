import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/division/divisionApi";
import { useAddTourMutation, useGetTourTypeQuery } from "@/redux/Tour/tour.api";
import { CalendarIcon } from "lucide-react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { format, formatISO } from "date-fns";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { useState } from "react";
import type { FileMetadata } from "@/hooks/use-file-upload";
// import { toast } from "sonner";
// import type { IErrorResponse } from "@/types/auth.type";

const AddTour = () => {
  const { data: divisionData , isLoading: divisionLoading } = useGetDivisionsQuery(undefined);
  const { data: tourTypeData } = useGetTourTypeQuery(undefined);
  const [addTour] = useAddTourMutation();
  
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);

  const divisionOption = divisionData?.map((item: { _id: string; name: string }) => ({
    value: item._id,
    label: item.name
  }))
  const tourOption = tourTypeData?.data.map((item: { _id: string; name: string }) => ({
    value: item._id,
    label: item.name
  }))
  const form = useForm({
    defaultValues: {
      title: "",
      division: "",
      tourType: "",
      description: "",
      location: "",
      costFrom: "",
      departureLocation: "",
      arrivalLocation: "",
      maxGuest: "",
      minAge: "",
      startDate: "",
      endDate: ""
    },
  });
const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
  const tourData = {
    ...data,
    startDate: formatISO(new Date(data.startDate)),
    endDate: formatISO(new Date(data.endDate)),
  };

  const formData = new FormData();
  
  
  formData.append("data", JSON.stringify(tourData));
  console.log(formData, tourData);
  images.forEach((image) => {
    if (image instanceof File) {
      formData.append("files", image);
    }
  });

  try {
    const res = await addTour(formData).unwrap();
    console.log(res);
    
    // if (res.success) {
    //   toast.success("Tour created");
    //   form.reset();
    // } else {
    //   toast.error("Something went wrong");
    // }
  } catch (err: unknown) {
    console.error(err);
    // toast.error((err as IErrorResponse).message || "Something went wrong");
  }
};

return (
  <div className="w-full max-w-4xl mx-auto px-5 mt-16">
    <Card>
      <CardHeader>
        <CardTitle>Add New Tour</CardTitle>
        <CardDescription>Add a new tour to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="add-tour-form"
            className="space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costFrom"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="departureLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Departure Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Arrival Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Division</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={divisionLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisionOption?.map(
                          (item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tourType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tour Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tourOption?.map(
                          (option: { value: string; label: string }) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="maxGuest"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Max Guest</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minAge"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Minimum Age</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5 items-stretch">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-[205px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1 mt-5">
                <MultipleImageUploader onChange={setImages} />
              </div>
            </div>
            <div className="border-t border-muted w-full "></div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button  type="submit" form="add-tour-form">
          Create Tour
        </Button>
      </CardFooter>
    </Card>
  </div>
);
};

export default AddTour;
