/**
 * Database Mock Factory
 *
 * Centralised mock generators for every repository contract in the project.
 * Services inject repositories through tokens (REPOSITORY_TOKENS_MAIN / TENANT),
 * so tests only need to provide these mocks — no real DB connection required.
 *
 * Usage:
 *   const module = await Test.createTestingModule({
 *     providers: [
 *       MyService,
 *       mockMainRepository(REPOSITORY_TOKENS_MAIN.USER_REPOSITORY, createMockUserRepository()),
 *       mockTenantRepository(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY, createMockEnterpriseRepository()),
 *     ],
 *   }).compile();
 */

/* ------------------------------------------------------------------ */
/*  Helper to build a NestJS provider from a token + mock object      */
/* ------------------------------------------------------------------ */

export function mockMainRepository(token: symbol, mock: Record<string, jest.Mock>) {
  return { provide: token, useValue: mock };
}

export function mockTenantRepository(token: symbol, mock: Record<string, jest.Mock>) {
  return { provide: token, useValue: mock };
}

/* ------------------------------------------------------------------ */
/*  MAIN database repository mocks                                    */
/* ------------------------------------------------------------------ */

export function createMockUserRepository() {
  return {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    comparePassword: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    createUsersByFile: jest.fn(),
    resetPassword: jest.fn(),
    validateRegistrationCodeAndConfirm: jest.fn(),
    confirmEmailByUserId: jest.fn(),
    setUserAuthCodes: jest.fn(),
  };
}

export function createMockTrialRepository() {
  return {
    getAllTrials: jest.fn(),
    getTrialById: jest.fn(),
    getTrialByEnterpriseAndUser: jest.fn(),
    getTrialByUserId: jest.fn(),
    createTrial: jest.fn(),
    updateTrial: jest.fn(),
    deleteTrial: jest.fn(),
  };
}

export function createMockPaymentRepository() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEnterpriseId: jest.fn(),
    getStats: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function createMockSubscriptionRepository() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdWithPlan: jest.fn(),
    findByTenantId: jest.fn(),
    findActiveByTenantId: jest.fn(),
    findByStripeSubscriptionId: jest.fn(),
    findForPaymentActivation: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function createMockPlanRepository() {
  return {
    findAll: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function createMockTenantAdminRepository() {
  return {
    listTenants: jest.fn(),
    userHasTenantAccess: jest.fn(),
    listEnterprisesByTenant: jest.fn(),
    listAllSocialMidiaInstanceKeys: jest.fn(),
    getTenantIdByInstanceKey: jest.fn(),
  };
}

export function createMockUrlShortenerRepository() {
  return {
    findByPath: jest.fn(),
    findByEnterpriseId: jest.fn(),
    isPathAvailable: jest.fn(),
    create: jest.fn(),
    updatePath: jest.fn(),
    softDeleteByEnterpriseId: jest.fn(),
  };
}

/* ------------------------------------------------------------------ */
/*  TENANT database repository mocks                                  */
/* ------------------------------------------------------------------ */

export function createMockEnterpriseRepository() {
  return {
    createEnterprise: jest.fn(),
    getAllEnterprises: jest.fn(),
    getEnterpriseById: jest.fn(),
    getMyEnterprises: jest.fn(),
    updateEnterprise: jest.fn(),
    deleteEnterprise: jest.fn(),
    transferOwnership: jest.fn(),
    updateGoogleTokens: jest.fn(),
    checkUserIsMember: jest.fn(),
    checkUserIsOwner: jest.fn(),
    getUserRoleInEnterprise: jest.fn(),
  };
}

export function createMockEnterpriseMemberRepository() {
  return {
    getAllMembers: jest.fn(),
    getMemberById: jest.fn(),
    getMemberByUserAndEnterprise: jest.fn(),
    createMember: jest.fn(),
    addMember: jest.fn(),
    updateMember: jest.fn(),
    deleteMember: jest.fn(),
    removeMember: jest.fn(),
  };
}

export function createMockEnterpriseInvitationRepository() {
  return {
    getAllInvitations: jest.fn(),
    getInvitationById: jest.fn(),
    getInvitationByToken: jest.fn(),
    checkInvitationExists: jest.fn(),
    createInvitation: jest.fn(),
    acceptInvitation: jest.fn(),
    declineInvitation: jest.fn(),
    cancelInvitation: jest.fn(),
    getMyPendingInvitations: jest.fn(),
    updateInvitation: jest.fn(),
    deleteInvitation: jest.fn(),
  };
}

export function createMockCalendarRepository() {
  return {
    createCalendar: jest.fn(),
    getAllCalendars: jest.fn(),
    getCalendarById: jest.fn(),
    getMyCalendars: jest.fn(),
    updateCalendar: jest.fn(),
    deleteCalendar: jest.fn(),
    upsertCalendar: jest.fn(),
    getCalendarByGoogleId: jest.fn(),
  };
}

export function createMockCalendarEventRepository() {
  return {
    createEvent: jest.fn(),
    getAllEvents: jest.fn(),
    getEventById: jest.fn(),
    getMyEvents: jest.fn(),
    getEnterpriseEvents: jest.fn(),
    upsertEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  };
}

export function createMockCalendarShareRepository() {
  return {
    getAllShares: jest.fn(),
    getShareById: jest.fn(),
    getMemberShares: jest.fn(),
    getShareByCalendarAndMember: jest.fn(),
    createShare: jest.fn(),
    updateShare: jest.fn(),
    deleteShare: jest.fn(),
  };
}

export function createMockAssistantRepository() {
  return {
    getAllAssistants: jest.fn(),
    getAssistantById: jest.fn(),
    createAssistant: jest.fn(),
    updateAssistant: jest.fn(),
    deleteAssistant: jest.fn(),
  };
}

export function createMockSocialMidiaRepository() {
  return {
    getAllInstances: jest.fn(),
    getInstanceById: jest.fn(),
    createInstance: jest.fn(),
    updateInstance: jest.fn(),
    deleteInstance: jest.fn(),
  };
}

export function createMockAiToolRepository() {
  return {
    getAllAiTools: jest.fn(),
    getAiToolById: jest.fn(),
    createAiTool: jest.fn(),
    updateAiTool: jest.fn(),
    deleteAiTool: jest.fn(),
  };
}

export function createMockAiRalphRepository() {
  return {
    getAllAiRalphs: jest.fn(),
    getAiRalphById: jest.fn(),
    createAiRalph: jest.fn(),
    createAiRalphVersion: jest.fn(),
    deleteAiRalph: jest.fn(),
  };
}

export function createMockCatalogCategoryRepository() {
  return {
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };
}

export function createMockProductRepository() {
  return {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };
}

export function createMockComboRepository() {
  return {
    getAllCombos: jest.fn(),
    getComboById: jest.fn(),
    createCombo: jest.fn(),
    updateCombo: jest.fn(),
    deleteCombo: jest.fn(),
  };
}

export function createMockOrderRepository() {
  return {
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    publicLookupOrders: jest.fn(),
    deleteOrder: jest.fn(),
  };
}

export function createMockCustomerRepository() {
  return {
    getAllCustomers: jest.fn(),
    getCustomerById: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
  };
}

export function createMockPipelineRepository() {
  return {
    getAllPipelines: jest.fn(),
    getPipelineById: jest.fn(),
    createPipeline: jest.fn(),
    updatePipeline: jest.fn(),
    deletePipeline: jest.fn(),
  };
}

export function createMockPipelineColumnRepository() {
  return {
    getAllPipelineColumns: jest.fn(),
    getColumnById: jest.fn(),
    getPipelineColumnById: jest.fn(),
    createPipelineColumn: jest.fn(),
    updatePipelineColumn: jest.fn(),
    deletePipelineColumn: jest.fn(),
  };
}

export function createMockPipelineCardRepository() {
  return {
    getAllPipelineCards: jest.fn(),
    getCardById: jest.fn(),
    createPipelineCard: jest.fn(),
    updatePipelineCard: jest.fn(),
    deletePipelineCard: jest.fn(),
  };
}

export function createMockConversationRepository() {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    getMessagesByCustomer: jest.fn(),
    sendMessage: jest.fn(),
    closeConversation: jest.fn(),
  };
}

export function createMockOfferingCategoryRepository() {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function createMockOfferingProfessionalRepository() {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function createMockOfferingServiceRepository() {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

/* ------------------------------------------------------------------ */
/*  Other common service mocks                                        */
/* ------------------------------------------------------------------ */

export function createMockEntityManager() {
  return {
    query: jest.fn(),
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }),
    transaction: jest.fn(),
  } as any;
}

export function createMockDataSource() {
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    query: jest.fn(),
    getRepository: jest.fn().mockReturnValue(mockRepo),
    manager: createMockEntityManager(),
  } as any;
}
