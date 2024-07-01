
        class ServiceFactory {
            static createBaseService(){ 
                return Reflect.construct(require("../service/BaseService.js"), []);
            }
static createCommentInfoService(){ 
                return Reflect.construct(require("../service/CommentInfoService.js"), []);
            }
static createGoodsClassInfoService(){ 
                return Reflect.construct(require("../service/GoodsClassInfoService.js"), []);
            }
static createGoodsInfoService(){ 
                return Reflect.construct(require("../service/GoodsInfoService.js"), []);
            }
static createGoodsOptionInfoService(){ 
                return Reflect.construct(require("../service/GoodsOptionInfoService.js"), []);
            }
static createOrderDetailInfoService(){ 
                return Reflect.construct(require("../service/OrderDetailInfoService.js"), []);
            }
static createOrderInfoService(){ 
                return Reflect.construct(require("../service/OrderInfoService.js"), []);
            }
static createPermissionInfoService(){ 
                return Reflect.construct(require("../service/PermissionInfoService.js"), []);
            }
static createRoleInfoService(){ 
                return Reflect.construct(require("../service/RoleInfoService.js"), []);
            }
static createRolePermissionInfoService(){ 
                return Reflect.construct(require("../service/RolePermissionInfoService.js"), []);
            }
static createShoppingCarInfoService(){ 
                return Reflect.construct(require("../service/ShoppingCarInfoService.js"), []);
            }
static createUserAddressInfoService(){ 
                return Reflect.construct(require("../service/UserAddressInfoService.js"), []);
            }
static createUserInfoService(){ 
                return Reflect.construct(require("../service/UserInfoService.js"), []);
            }
static createUserRoleInfoService(){ 
                return Reflect.construct(require("../service/UserRoleInfoService.js"), []);
            }
        }

        module.exports = ServiceFactory;
    