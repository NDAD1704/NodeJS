for i in range(1024, 9876,2):
    ABC=i//10
    D=i%10
    C=ABC%10
    DCDC=D*1000+C*100+D*10+C
    if (i-ABC==DCDC):
        print(i)