import { MessageCircleHeartIcon, Mic } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { getBetaUsers } from "@/apis/BetaFeedback";

const FeedbackButton = () => {
  const [users, setUsers] = useState([
    "Ayush Jain",
    "Arnab Kar",
    "Sidharth Premdas",
  ]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    getBetaUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <MessageCircleHeartIcon />
          Give us Feedback!
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        {!currentUser ? (
          <Command>
            <CommandInput placeholder="Select your name" />
            <CommandList>
              <CommandEmpty> Trouble getting the names List...</CommandEmpty>
              <CommandGroup>
                {users.map((user, index) => (
                  <CommandItem
                    key={index}
                    value={user}
                    onSelect={() => {
                      setCurrentUser(user);
                    }}
                  >
                    {user}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <FeedbackCard
            user={currentUser}
            clearUser={() => setCurrentUser("")}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export default FeedbackButton;