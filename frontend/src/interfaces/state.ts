import { FilterBy, FilterByUsers } from "./filterBy";
import { Story } from "./story";
import { User } from "./user";

export interface RootState {
    storyModule: storyModule
    userModule: UserModule
}

interface storyModule {
    storys: Story[]
    filterBy: FilterBy
}

interface UserModule {
    users: User[]
    searchedUsers: User[]
    loggedInUser: User | null
    filterBy: FilterByUsers
}

export interface INITIAL_STATE {
    storys?: Story[]
    users?: User[]
}