import { authenticationService } from "../services/authentication.service";

export const authHeader = () => {
    const currentUser = authenticationService.currentUserValue;

    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    }

    return {};
}