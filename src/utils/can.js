import store from "../store";
import {actions, features} from "../constants/permission";
import ROLES from "../constants/role";

function defineAbility(roles) {
    let permissions = [
        { act: actions.readAll, feat: 'All' }
    ];

    if (roles.includes(ROLES.admin.id)) {
        permissions = [
            ...permissions,
            { act: actions.read, feat: features.department },
            { act: actions.read, feat: features.designation },
            { act: actions.read, feat: features.expense },
            { act: actions.create, feat: features.department },
            { act: actions.create, feat: features.designation },
            { act: actions.create, feat: features.expense },
            { act: actions.update, feat: features.setting }
        ]
    }

    if ([ROLES.admin.id, ROLES.humanresource.id].some(e => roles.includes(e))) {
        permissions = [
            ...permissions,
            { act: actions.readAll, feat: features.user },
            { act: actions.readAll, feat: features.department},
            { act: actions.readAll, feat: features.attendance},
            { act: actions.readAll, feat: features.expense },
            { act: actions.readAll, feat: features.leave },
            { act: actions.readAll, feat: features.report },
            { act: actions.create, feat: features.user }
        ];
    }

    if ([ROLES.admin.id, ROLES.humanresource.id, ROLES.manager.id].some(e => roles.includes(e))) {
        permissions = [
            ...permissions,
            { act: actions.read, feat: features.user },
            { act: actions.read, feat: features.attendance },
            { act: actions.read, feat: features.leave },
            { act: actions.read, feat: features.report }
        ];
    }

    if (roles.includes(ROLES.manager.id)) {
        permissions = [
            ...permissions,
            { act: actions.readSome, feat: features.user },
            { act: actions.readSome, feat: features.attendance },
            { act: actions.readSome, feat: features.leave },
            { act: actions.readSome, feat: features.report }
        ]
    }

    if ([ROLES.employee.id].some(e => roles.includes(e))) {
        permissions = [
            ...permissions,
            { act: actions.read, feat: features.attendance },
            { act: actions.readSelf, feat: features.attendance },
            { act: actions.read, feat: features.leave },
            { act: actions.readSelf, feat: features.leave }
        ]
    }

    return permissions;
}

export default function Can(act, feat) {
    const state = store.getState();
    const roles = state.user.profile?.role ?? [];
    const permissions = defineAbility(roles);

    return Boolean(permissions.find(e => e.act === act && e.feat === feat));
}